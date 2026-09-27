export const Header = ({ anoAtual }: { anoAtual: number }) => (
  <header className="max-w-3xl">
    <h1 className="font-fredoka text-xl font-semibold text-primary-dark md:text-2xl">
      Importar dados
    </h1>
    <p className="mt-1 text-sm text-zinc-500 sm:text-base">
      Escolha o ano e o evento publicado no Sympla para importar os cursos com
      base nos nomes dos ingressos dos inscritos aprovados.
    </p>
    <p className="mt-3 text-sm text-zinc-600 sm:text-base">
      A senha padrão dos alunos importados é o primeiro nome, em minúsculas,
      seguido do ano atual.
    </p>
    <p className="mt-1 text-sm text-zinc-600 sm:text-base">
      Exemplo: maria{anoAtual}.
    </p>
  </header>
);
