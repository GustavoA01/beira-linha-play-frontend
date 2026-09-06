import type {
  AlternativaType,
  AtividadeType,
  CursoType,
  ModuloType,
  QuestaoType,
} from '@/data/types/api';

const alternativa = (
  id: string,
  descricao: string,
  correta = false
): AlternativaType => ({ id, descricao, correta });

const questao = (
  id: string,
  enunciado: string,
  valor: number,
  alternativas: AlternativaType[]
): QuestaoType => ({ id, enunciado, valor, alternativas });

const atividade = (
  id: string,
  titulo: string,
  moduloId: string,
  questoes: QuestaoType[]
): AtividadeType => ({
  id,
  titulo,
  moduloId,
  quantQuestoes: questoes.length,
  questoes,
});

export const xpDaAtividade = (item: AtividadeType) =>
  item.questoes.reduce((total, q) => total + q.valor, 0);

export const xpDoModulo = (modulo: ModuloType) =>
  modulo.atividades.reduce((total, item) => total + xpDaAtividade(item), 0);

export const contarAtividadesDoCurso = (curso: CursoType) =>
  curso.modulos.reduce((total, modulo) => total + modulo.atividades.length, 0);

export const getCursoById = (id: string) =>
  temporaryCursos.find((curso) => curso.id === id);

export const getModuloById = (cursoId: string, moduloId: string) =>
  getCursoById(cursoId)?.modulos.find((modulo) => modulo.id === moduloId);

export const getAtividadeById = (
  cursoId: string,
  moduloId: string,
  atividadeId: string
) =>
  getModuloById(cursoId, moduloId)?.atividades.find(
    (atividade) => atividade.id === atividadeId
  );

const moduloLimites: ModuloType = {
  id: 'modulo-limites',
  nome: 'Limites',
  cursoId: 'curso-calculo-1',
  atividades: [
    atividade(
      'atv-nocao-limite',
      'Noção intuitiva de limite',
      'modulo-limites',
      [
        questao(
          'q-lim-1',
          'O que representa o limite de f(x) quando x tende a a?',
          2,
          [
            alternativa('a-lim-1-a', 'O valor que f assume em a'),
            alternativa(
              'a-lim-1-b',
              'O valor do qual f se aproxima quando x se aproxima de a',
              true
            ),
            alternativa('a-lim-1-c', 'A derivada de f em a'),
            alternativa('a-lim-1-d', 'A área sob o gráfico de f'),
          ]
        ),
        questao('q-lim-2', 'O limite de sen(x)/x quando x tende a 0 vale:', 3, [
          alternativa('a-lim-2-a', '0'),
          alternativa('a-lim-2-b', '1', true),
          alternativa('a-lim-2-c', 'infinito'),
          alternativa('a-lim-2-d', 'não existe'),
        ]),
      ]
    ),
    atividade('atv-limites-laterais', 'Limites laterais', 'modulo-limites', [
      questao('q-lat-1', 'O limite existe quando os limites laterais:', 2, [
        alternativa('a-lat-1-a', 'São diferentes'),
        alternativa('a-lat-1-b', 'Existem e são iguais', true),
        alternativa('a-lat-1-c', 'Tendem a infinito'),
      ]),
      questao(
        'q-lat-2',
        'Se lim x→a⁻ f(x) = 2 e lim x→a⁺ f(x) = 3, então:',
        2,
        [
          alternativa('a-lat-2-a', 'lim x→a f(x) = 2,5'),
          alternativa('a-lat-2-b', 'lim x→a f(x) = 2'),
          alternativa('a-lat-2-c', 'O limite não existe', true),
        ]
      ),
    ]),
  ],
};

const moduloDerivadas: ModuloType = {
  id: 'modulo-derivadas',
  nome: 'Derivadas',
  cursoId: 'curso-calculo-1',
  atividades: [
    atividade(
      'atv-regras-derivacao',
      'Regras de derivação',
      'modulo-derivadas',
      [
        questao('q-der-1', 'A derivada de xⁿ é:', 1, [
          alternativa('a-der-1-a', 'n·xⁿ⁻¹', true),
          alternativa('a-der-1-b', 'xⁿ⁺¹ / n'),
          alternativa('a-der-1-c', 'n·xⁿ'),
          alternativa('a-der-1-d', 'xⁿ⁻¹'),
        ]),
        questao('q-der-2', 'A derivada de sen(x) é:', 2, [
          alternativa('a-der-2-a', '−sen(x)'),
          alternativa('a-der-2-b', 'cos(x)', true),
          alternativa('a-der-2-c', '−cos(x)'),
          alternativa('a-der-2-d', 'tg(x)'),
        ]),
        questao('q-der-3', 'A derivada de eˣ é:', 1, [
          alternativa('a-der-3-a', 'x·eˣ⁻¹'),
          alternativa('a-der-3-b', 'eˣ', true),
          alternativa('a-der-3-c', 'ln(x)'),
        ]),
        questao('q-der-4', 'A regra da cadeia deriva:', 3, [
          alternativa('a-der-4-a', 'Um produto de funções'),
          alternativa('a-der-4-b', 'Uma composição de funções', true),
          alternativa('a-der-4-c', 'Uma soma de funções'),
          alternativa('a-der-4-d', 'Uma constante'),
        ]),
      ]
    ),
    atividade(
      'atv-derivada-produto',
      'Derivada do produto',
      'modulo-derivadas',
      [
        questao('q-prod-1', 'A derivada de u·v é:', 2, [
          alternativa('a-prod-1-a', "u'·v'"),
          alternativa('a-prod-1-b', "u'·v + u·v'", true),
          alternativa('a-prod-1-c', "u'·v − u·v'"),
          alternativa('a-prod-1-d', '(u·v) / x'),
        ]),
        questao('q-prod-2', 'A derivada de x·sen(x) é:', 3, [
          alternativa('a-prod-2-a', 'sen(x) + x·cos(x)', true),
          alternativa('a-prod-2-b', 'x·cos(x)'),
          alternativa('a-prod-2-c', 'sen(x)·cos(x)'),
          alternativa('a-prod-2-d', 'cos(x)'),
        ]),
      ]
    ),
    atividade(
      'atv-aplicacoes-derivada',
      'Aplicações da derivada',
      'modulo-derivadas',
      [
        questao('q-ap-1', 'Um ponto crítico de f ocorre quando:', 2, [
          alternativa('a-ap-1-a', 'f(x) = 0'),
          alternativa('a-ap-1-b', "f'(x) = 0 ou f' não existe", true),
          alternativa('a-ap-1-c', "f''(x) = 0"),
        ]),
        questao('q-ap-2', 'Se f′(x) > 0 em um intervalo, f é:', 1, [
          alternativa('a-ap-2-a', 'Crescente', true),
          alternativa('a-ap-2-b', 'Decrescente'),
          alternativa('a-ap-2-c', 'Constante'),
        ]),
      ]
    ),
  ],
};

const moduloIntegrais: ModuloType = {
  id: 'modulo-integrais',
  nome: 'Integrais',
  cursoId: 'curso-calculo-1',
  atividades: [
    atividade(
      'atv-integral-indefinida',
      'Integral indefinida',
      'modulo-integrais',
      [
        questao('q-int-1', 'A integral de x² dx é:', 2, [
          alternativa('a-int-1-a', 'x³ / 3 + C', true),
          alternativa('a-int-1-b', '2x + C'),
          alternativa('a-int-1-c', 'x³ + C'),
          alternativa('a-int-1-d', '3x² + C'),
        ]),
        questao('q-int-2', 'A integral é a operação inversa da:', 1, [
          alternativa('a-int-2-a', 'Multiplicação'),
          alternativa('a-int-2-b', 'Derivada', true),
          alternativa('a-int-2-c', 'Potenciação'),
        ]),
      ]
    ),
    atividade(
      'atv-teorema-fundamental',
      'Teorema fundamental',
      'modulo-integrais',
      [
        questao('q-tf-1', 'O teorema fundamental do cálculo relaciona:', 3, [
          alternativa('a-tf-1-a', 'Limite e continuidade'),
          alternativa('a-tf-1-b', 'Derivada e integral', true),
          alternativa('a-tf-1-c', 'Soma e produto'),
          alternativa('a-tf-1-d', 'Máximos e mínimos'),
        ]),
      ]
    ),
  ],
};

const moduloVariaveis: ModuloType = {
  id: 'modulo-variaveis',
  nome: 'Variáveis e tipos',
  cursoId: 'curso-prog-1',
  atividades: [
    atividade('atv-tipos-primitivos', 'Tipos primitivos', 'modulo-variaveis', [
      questao('q-tipo-1', 'Qual tipo armazena texto?', 1, [
        alternativa('a-tipo-1-a', 'int'),
        alternativa('a-tipo-1-b', 'string', true),
        alternativa('a-tipo-1-c', 'boolean'),
        alternativa('a-tipo-1-d', 'float'),
      ]),
      questao('q-tipo-2', 'O valor true pertence ao tipo:', 1, [
        alternativa('a-tipo-2-a', 'number'),
        alternativa('a-tipo-2-b', 'boolean', true),
        alternativa('a-tipo-2-c', 'string'),
      ]),
    ]),
    atividade('atv-entrada-saida', 'Entrada e saída', 'modulo-variaveis', [
      questao('q-io-1', 'Em JavaScript, qual função exibe no console?', 2, [
        alternativa('a-io-1-a', 'print()'),
        alternativa('a-io-1-b', 'console.log()', true),
        alternativa('a-io-1-c', 'echo()'),
        alternativa('a-io-1-d', 'System.out()'),
      ]),
    ]),
  ],
};

const moduloFuncoes: ModuloType = {
  id: 'modulo-funcoes',
  nome: 'Funções',
  cursoId: 'curso-prog-1',
  atividades: [
    atividade(
      'atv-declaracao-funcoes',
      'Declarando funções',
      'modulo-funcoes',
      [
        questao(
          'q-fn-1',
          'Uma função que não devolve valor costuma retornar:',
          2,
          [
            alternativa('a-fn-1-a', 'null'),
            alternativa('a-fn-1-b', 'undefined', true),
            alternativa('a-fn-1-c', '0'),
            alternativa('a-fn-1-d', 'false'),
          ]
        ),
        questao('q-fn-2', 'Parâmetros de uma função são:', 1, [
          alternativa('a-fn-2-a', 'Valores recebidos na chamada', true),
          alternativa('a-fn-2-b', 'Variáveis globais'),
          alternativa('a-fn-2-c', 'O resultado da função'),
        ]),
      ]
    ),
    atividade('atv-parametros', 'Parâmetros e retorno', 'modulo-funcoes', [
      questao('q-par-1', 'O que faz return em uma função?', 2, [
        alternativa('a-par-1-a', 'Pausa o programa'),
        alternativa('a-par-1-b', 'Devolve um valor e encerra a função', true),
        alternativa('a-par-1-c', 'Imprime no console'),
      ]),
    ]),
  ],
};

const moduloArrays: ModuloType = {
  id: 'modulo-arrays',
  nome: 'Arrays',
  cursoId: 'curso-prog-1',
  atividades: [
    atividade('atv-percorrendo-arrays', 'Percorrendo arrays', 'modulo-arrays', [
      questao('q-arr-1', 'O primeiro índice de um array em JS é:', 1, [
        alternativa('a-arr-1-a', '1'),
        alternativa('a-arr-1-b', '0', true),
        alternativa('a-arr-1-c', '-1'),
      ]),
      questao('q-arr-2', 'array.length devolve:', 2, [
        alternativa('a-arr-2-a', 'O último elemento'),
        alternativa('a-arr-2-b', 'A quantidade de elementos', true),
        alternativa('a-arr-2-c', 'O maior valor'),
        alternativa('a-arr-2-d', 'O tipo dos elementos'),
      ]),
    ]),
  ],
};

const moduloCinematica: ModuloType = {
  id: 'modulo-cinematica',
  nome: 'Cinemática',
  cursoId: 'curso-fisica-1',
  atividades: [
    atividade('atv-mru', 'Movimento retilíneo uniforme', 'modulo-cinematica', [
      questao('q-mru-1', 'No MRU, a aceleração é:', 2, [
        alternativa('a-mru-1-a', 'Constante e diferente de zero'),
        alternativa('a-mru-1-b', 'Nula', true),
        alternativa('a-mru-1-c', 'Crescente'),
        alternativa('a-mru-1-d', 'Igual à velocidade'),
      ]),
      questao('q-mru-2', 'A equação horária do MRU é:', 3, [
        alternativa('a-mru-2-a', 'S = S₀ + v·t', true),
        alternativa('a-mru-2-b', 'S = S₀ + v·t + at²/2'),
        alternativa('a-mru-2-c', 'v = v₀ + a·t'),
      ]),
    ]),
    atividade(
      'atv-mruv',
      'Movimento uniformemente variado',
      'modulo-cinematica',
      [
        questao('q-mruv-1', 'No MRUV, a aceleração é:', 2, [
          alternativa('a-mruv-1-a', 'Nula'),
          alternativa('a-mruv-1-b', 'Constante', true),
          alternativa('a-mruv-1-c', 'Igual à velocidade'),
        ]),
      ]
    ),
  ],
};

const moduloDinamica: ModuloType = {
  id: 'modulo-dinamica',
  nome: 'Dinâmica',
  cursoId: 'curso-fisica-1',
  atividades: [
    atividade('atv-leis-newton', 'Leis de Newton', 'modulo-dinamica', [
      questao('q-new-1', 'A segunda lei de Newton é:', 2, [
        alternativa('a-new-1-a', 'F = m·a', true),
        alternativa('a-new-1-b', 'F = m·v'),
        alternativa('a-new-1-c', 'E = m·c²'),
        alternativa('a-new-1-d', 'P = m·g·h'),
      ]),
      questao('q-new-2', 'A primeira lei de Newton trata da:', 1, [
        alternativa('a-new-2-a', 'Ação e reação'),
        alternativa('a-new-2-b', 'Inércia', true),
        alternativa('a-new-2-c', 'Gravitação'),
      ]),
    ]),
    atividade('atv-forca-atrito', 'Força de atrito', 'modulo-dinamica', [
      questao('q-atr-1', 'O atrito cinético atua quando o corpo:', 2, [
        alternativa('a-atr-1-a', 'Está em movimento', true),
        alternativa('a-atr-1-b', 'Está parado'),
        alternativa('a-atr-1-c', 'Não tem massa'),
      ]),
    ]),
  ],
};

const moduloModeloRelacional: ModuloType = {
  id: 'modulo-modelo-relacional',
  nome: 'Modelo relacional',
  cursoId: 'curso-bd-1',
  atividades: [
    atividade(
      'atv-entidade-relacionamento',
      'Entidade e relacionamento',
      'modulo-modelo-relacional',
      [
        questao('q-er-1', 'Uma entidade no modelo ER representa:', 2, [
          alternativa('a-er-1-a', 'Um relacionamento entre tabelas'),
          alternativa(
            'a-er-1-b',
            'Um objeto do mundo real que se deseja armazenar',
            true
          ),
          alternativa('a-er-1-c', 'Um índice do banco'),
          alternativa('a-er-1-d', 'Uma consulta SQL'),
        ]),
      ]
    ),
    atividade(
      'atv-chaves',
      'Chaves primária e estrangeira',
      'modulo-modelo-relacional',
      [
        questao('q-ch-1', 'A chave primária deve ser:', 2, [
          alternativa('a-ch-1-a', 'Nula em alguns registros'),
          alternativa('a-ch-1-b', 'Única e não nula', true),
          alternativa('a-ch-1-c', 'Igual à chave estrangeira'),
        ]),
        questao('q-ch-2', 'A chave estrangeira serve para:', 3, [
          alternativa('a-ch-2-a', 'Ordenar a tabela'),
          alternativa(
            'a-ch-2-b',
            'Referenciar a chave primária de outra tabela',
            true
          ),
          alternativa('a-ch-2-c', 'Criptografar os dados'),
          alternativa('a-ch-2-d', 'Apagar duplicatas'),
        ]),
      ]
    ),
  ],
};

const moduloSql: ModuloType = {
  id: 'modulo-sql',
  nome: 'SQL',
  cursoId: 'curso-bd-1',
  atividades: [
    atividade('atv-select', 'Consultas SELECT', 'modulo-sql', [
      questao('q-sel-1', 'Qual cláusula filtra linhas no SELECT?', 1, [
        alternativa('a-sel-1-a', 'ORDER BY'),
        alternativa('a-sel-1-b', 'WHERE', true),
        alternativa('a-sel-1-c', 'GROUP BY'),
        alternativa('a-sel-1-d', 'FROM'),
      ]),
      questao('q-sel-2', 'SELECT DISTINCT serve para:', 2, [
        alternativa('a-sel-2-a', 'Ordenar os resultados'),
        alternativa('a-sel-2-b', 'Remover linhas duplicadas', true),
        alternativa('a-sel-2-c', 'Juntar tabelas'),
      ]),
    ]),
    atividade('atv-joins', 'Junções (JOIN)', 'modulo-sql', [
      questao('q-join-1', 'INNER JOIN devolve:', 3, [
        alternativa('a-join-1-a', 'Todas as linhas das duas tabelas'),
        alternativa(
          'a-join-1-b',
          'Apenas as linhas com correspondência nas duas tabelas',
          true
        ),
        alternativa('a-join-1-c', 'Só as linhas da tabela da esquerda'),
      ]),
    ]),
    atividade('atv-agregacoes', 'Funções de agregação', 'modulo-sql', [
      questao('q-ag-1', 'COUNT(*) devolve:', 1, [
        alternativa('a-ag-1-a', 'A soma dos valores'),
        alternativa('a-ag-1-b', 'A quantidade de linhas', true),
        alternativa('a-ag-1-c', 'O maior valor'),
      ]),
      questao('q-ag-2', 'GROUP BY é usado junto com:', 2, [
        alternativa('a-ag-2-a', 'Funções de agregação', true),
        alternativa('a-ag-2-b', 'CREATE TABLE'),
        alternativa('a-ag-2-c', 'PRIMARY KEY'),
        alternativa('a-ag-2-d', 'INSERT'),
      ]),
    ]),
  ],
};

export const temporaryCursos: CursoType[] = [
  {
    id: 'curso-calculo-1',
    nome: 'Cálculo I',
    codigoAcesso: 'CALC-2026-A',
    monitorIds: ['monitor-1'],
    modulos: [moduloLimites, moduloDerivadas, moduloIntegrais],
  },
  {
    id: 'curso-prog-1',
    nome: 'Programação I',
    codigoAcesso: 'PROG-2026-A',
    monitorIds: ['monitor-2'],
    modulos: [moduloVariaveis, moduloFuncoes, moduloArrays],
  },
  {
    id: 'curso-fisica-1',
    nome: 'Física I',
    codigoAcesso: 'FIS-2026-A',
    monitorIds: ['monitor-3'],
    modulos: [moduloCinematica, moduloDinamica],
  },
  {
    id: 'curso-bd-1',
    nome: 'Banco de Dados',
    codigoAcesso: 'BD-2026-A',
    monitorIds: ['monitor-4'],
    modulos: [moduloModeloRelacional, moduloSql],
  },
];

export const temporaryModulos: ModuloType[] = temporaryCursos.flatMap(
  (curso) => curso.modulos
);

export const temporaryAtividades: AtividadeType[] = temporaryModulos.flatMap(
  (modulo) => modulo.atividades
);
