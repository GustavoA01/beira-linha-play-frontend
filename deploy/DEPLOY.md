# Deploy Beira Linha Play (VPS + Docker)

Handoff por **imagens Docker** (`docker save` / `docker load`). Quem sobe o servidor **não precisa** do código-fonte, Maven nem Node.

Há dois Composes:

| Arquivo                    | Onde                             | Função                                                        |
| -------------------------- | -------------------------------- | ------------------------------------------------------------- |
| `docker-compose.build.yml` | Sua máquina (com os dois clones) | Constrói `beira-linha-play-api` e `beira-linha-play-frontend` |
| `docker-compose.prod.yml`  | VPS                              | Sobe Postgres + API + frontend. Só `image:`, sem `build:`     |

Dev local continua com `docker-compose.yml` / `docker-compose.local-db.yml` (portas 5173 e 8080). Produção **não** publica 8080 nem 5432.

## 1. Na sua máquina (gerar o pacote)

Requisitos: Docker Desktop, clones `beira-linha-play-frontend` e `beira-linha-play-backend` lado a lado nesta pasta.

1. Preencha `beira-linha-play-backend/.env` (ou o `.env` da VPS) com Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`. Upload/exclusão de medalhas passam pela API; nada disso entra no JavaScript.
2. O `docker-compose.build.yml` força `VITE_API_URL` vazio na imagem (same-origin `/api`).
3. Na pasta pai:

Windows:

```powershell
.\scripts\export-images.ps1
.\scripts\export-images.ps1 -IncludePostgres
```

Linux / macOS:

```bash
chmod +x scripts/export-images.sh
./scripts/export-images.sh
./scripts/export-images.sh --include-postgres
```

`-IncludePostgres` / `--include-postgres` só se a VPS **não** tiver internet para puxar o Postgres.

O script gera `deploy-out/`:

- `beira-linha-play-api.tar.gz`
- `beira-linha-play-frontend.tar.gz`
- `postgres-16-alpine.tar.gz` (só com `-IncludePostgres`)
- `docker-compose.prod.yml`
- `docker-compose.https.yml`
- `Caddyfile`
- `.env.example`
- `DEPLOY.md`

Zippe **essa pasta**. Os `.tar.gz` são grandes (centenas de MB). Não coloque um `.env` já preenchido com senhas reais no zip se for mandar para outra pessoa — eles copiam `.env.example` → `.env` no servidor.

Atualizar depois: rode o script de novo, envie os tars novos, na VPS `docker load` + `up -d`.

## 2. Na VPS (Hostinger ou outro)

### Docker

Ubuntu (ajuste se a imagem da VPS for outra):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a644 /etc/apt/keyrings/docker.asc
. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $VERSION_CODENAME stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Saia e entre de novo no SSH para o grupo `docker` valer.

RAM: **~2 GB** para rodar. 4 GB fica mais folgado. Não precisa RAM de build.

### Portas

No painel da Hostinger e no `ufw` (se estiver ativo), libere **80**. Quando for HTTPS, libere também **443**.

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Subir

Copie o zip (SFTP/`scp`), extraia, entre na pasta:

```bash
gunzip -c beira-linha-play-api.tar.gz | docker load
gunzip -c beira-linha-play-frontend.tar.gz | docker load
# se veio o postgres no zip:
gunzip -c postgres-16-alpine.tar.gz | docker load
```

```bash
cp .env.example .env
nano .env
```

Preencha:

- `POSTGRES_PASSWORD` forte
- `JWT_SECRET` — `openssl rand -base64 64`
- `GEMINI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `APP_ALLOWED_HOSTS=http://IP_PUBLICO` (o IP da VPS, com `http://`)
- `APP_COOKIE_SECURE=false` enquanto for HTTP

```bash
docker compose -f docker-compose.prod.yml up -d
```

**Sem** `--build`. Os três serviços entram na rede `beira-linha-play` (`postgres`, `api` e `frontend` se resolvem pelo nome). A API sobe com o perfil Spring `prod` (sem debug, sem SQL no log, sem detalhe de erro na resposta). Teste o login em `http://IP`.

Se a VPS tiver internet e você **não** levou o tar do Postgres, o Compose puxa `postgres:16-alpine` sozinho no primeiro `up`.

### Backup do banco

```bash
docker exec beira-linha-play-postgres pg_dump -U beira beira_linha_play > backup-$(date +%F).sql
```

O volume `beira_linha_pgdata` sobrevive a `compose down`. `compose down -v` **apaga** o banco.

### Atualizar a aplicação

Carregue os tars novos e recrie os containers (o volume do Postgres permanece):

```bash
gunzip -c beira-linha-play-api.tar.gz | docker load
gunzip -c beira-linha-play-frontend.tar.gz | docker load
docker compose -f docker-compose.prod.yml up -d
```

## 3. HTTPS depois (domínio)

1. Registro DNS **A** do domínio → IP da VPS.
2. No `.env`: `APP_DOMAIN=app.seudominio.com`, `APP_ALLOWED_HOSTS=https://app.seudominio.com`, `APP_COOKIE_SECURE=true`.
3. Libere a porta 443.
4. Suba o overlay (Caddy tira o 80 do frontend e passa a escutar 80/443):

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.https.yml up -d
```

O Caddy obtém certificado Let's Encrypt sozinho. Precisa de Docker Compose v2.24+ pelo `ports: !reset` no overlay.

## Cookies e CORS

A imagem do frontend é same-origin (`VITE_API_URL` vazio). Cookies HttpOnly com `SameSite=Lax`. Em HTTP, `APP_COOKIE_SECURE` tem que ser `false` ou o browser não grava sessão. `APP_ALLOWED_HOSTS` deve ser exatamente a origem que o usuário vê na barra (`http://IP` ou `https://dominio`).

## Alternativa: JAR + dist (sem tars grandes)

Se no futuro os `.tar.gz` forem impraticáveis de enviar, dá para gerar `app.jar` (`mvn -DskipTests package`) e `dist/` (`npm run build`) na sua máquina e usar Dockerfiles de runtime que só fazem `COPY` desses artefatos. A VPS ainda usa containers; o `compose up --build` só empacota, não compila. Este repositório está preparado para o fluxo de **imagens prontas**, que é o handoff padrão.
