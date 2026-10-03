# Beira Linha Play

Front-end da plataforma de gamificação do Beira Linha.

## Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS + componentes Radix/shadcn
- XYFlow (mapa)
- Jest + Testing Library

## Pré-requisitos

- Node.js 22+
- npm
- API do backend rodando (padrão: `http://localhost:8080`)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

No celular na mesma rede, abra `http://SEU_IP:5173` e deixe `VITE_API_URL` vazio no `.env` para usar o proxy `/api` do Vite. Não use `localhost` no aparelho.

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL absoluta da API. Vazio = mesma origem `/api` (proxy no `npm run dev`, nginx no Docker). |

Exemplo local apontando direto para o backend:

```env
VITE_API_URL=http://localhost:8080
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção (`tsc` + Vite) |
| `npm run preview` | Preview do build |
| `npm test` | Testes com Jest |
| `npm run lint` | ESLint |

## Papéis

- **Aluno**: mapa em `/`, atividades, ranking e medalhas. Entra em turma pelo código de acesso.
- **Monitor**: cursos que ministra, criação/edição de atividades e monitoramento. Mapa em `/mapa`.
- **Admin**: todos os cursos, criação/edição/exclusão de curso, criação de outro admin e importação de participantes (`/importacao`).

Rotas privadas exigem sessão. Sem usuário logado, o app redireciona para `/login`.

## Estrutura

```text
src/
  components/   # peças globais (Header, ui/)
  features/     # blocos reutilizados em mais de uma página
  pages/        # uma pasta por rota (nome em português)
  hooks/        # hooks globais
  data/         # tipos de domínio, schemas e mocks
  providers/    # sessão (UserProvider)
  services/     # chamadas à API
  router.ts     # definição das URLs
```

Regras rápidas:

- usado em 2+ páginas → `src/features/`
- só numa tela, peça solta → `pages/<tela>/components/`
- só numa tela, bloco com estado → `pages/<tela>/features/<Nome>/`
- botão, dialog ou layout genérico → `src/components`

Pastas em `pages/` não criam rota sozinhas. As URLs ficam em `src/router.ts`.

## Rotas principais

| Rota | Descrição |
| --- | --- |
| `/` | Home: mapa do aluno; monitor/admin vão para `/cursos` |
| `/mapa` | Mapa para monitor e admin |
| `/cursos` | Lista de cursos |
| `/cursos/:cursoId` | Detalhe do curso |
| `/cursos/:cursoId/modulos/:moduloId` | Módulo e atividades |
| `.../atividades/:atividadeId` | Jogo do aluno |
| `.../nova-atividade` | Criação/edição de atividade (monitor) |
| `.../monitoramento/:atividadeId` | Monitoramento (monitor) |
| `/importacao` | Importação de participantes (admin) |
| `/rankings` | Ranking |
| `/medalhas` | Medalhas (aluno e admin) |
| `/login` / `/cadastro` | Autenticação |

## Docker

```bash
docker build -t beira-linha-play .
docker run --rm -p 8080:80 beira-linha-play
```

A imagem de produção usa nginx e deixa `VITE_API_URL` vazio por padrão (mesma origem `/api`). Para build com API absoluta:

```bash
docker build --build-arg VITE_API_URL=https://sua-api.exemplo.com -t beira-linha-play .
```

## Testes

```bash
npm test
```

Os specs ficam próximos das telas, em `src/pages/<tela>/tests/` ou `src/**/*.spec.tsx`.
