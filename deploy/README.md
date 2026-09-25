Espelho versionado do pacote de deploy (a pasta pai `beira-linha-play` **não** é um git).

Os arquivos operacionais que o script usa estão na pasta pai:

- `docker-compose.build.yml` — gera as imagens na sua máquina
- `docker-compose.prod.yml` / `docker-compose.https.yml` / `Caddyfile` — VPS
- `scripts/export-images.ps1` (Windows) e `scripts/export-images.sh` (Linux)
- `DEPLOY.md`

Se clonar só este repo, copie estes arquivos para a pasta pai (ao lado de `beira-linha-play-frontend` e `beira-linha-play-backend`) e rode:

```powershell
..\..\scripts\export-images.ps1
```

```bash
chmod +x ../../scripts/export-images.sh
../../scripts/export-images.sh
```

ou, se o script já estiver na pai:

```powershell
.\scripts\export-images.ps1
```

```bash
./scripts/export-images.sh
```

Passo a passo completo: [DEPLOY.md](./DEPLOY.md).

`docker-compose.build.yml` neste diretório usa caminhos `./beira-linha-play-backend` — só funciona se o Compose for executado **na pasta pai**, não daqui.
