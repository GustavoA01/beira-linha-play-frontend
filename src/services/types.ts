export type UsuarioResponse = {
  id: string;
  nome: string;
  email: string | null;
  tipo: 'ALUNO' | 'MONITOR' | 'ADMIN';
  cursoIds: string[];
  apelido: string | null;
  pontos: number | null;
  imagemPerfil: string | null;
  cursoOrigem: string | null;
};

export type LoginPayload = {
  tipo: 'ALUNO' | 'MONITOR' | 'ADMIN';
  senha: string;
  apelido?: string;
  email?: string;
  nome?: string;
};

export type CadastroPayload = {
  tipo: 'ALUNO' | 'MONITOR';
  nome: string;
  senha: string;
  apelido?: string;
  email?: string;
};

export type AtualizarContaPayload = {
  nome?: string;
  apelido?: string;
  email?: string;
  senha?: string;
};

export type CriarAdminPayload = {
  nome: string;
  senha: string;
};

export type CursoModuloResumo = {
  id: string;
  nome: string;
  cursoId: string;
};

export type CursoResponse = {
  id: string;
  nome: string;
  codigoAcesso: string | null;
  monitorIds: string[];
  modulos: CursoModuloResumo[];
};

export type SalvarCursoPayload = {
  nome: string;
  monitorIds: string[];
};

export type InscreverCursoPayload = {
  codigoAcesso: string;
};

export type ModuloAtividadeResumo = {
  id: string;
  titulo: string;
  quantQuestoes: number;
  moduloId: string;
};

export type ModuloResponse = {
  id: string;
  nome: string;
  cursoId: string;
  atividades: ModuloAtividadeResumo[];
};

export type SalvarModuloPayload = {
  nome: string;
};

export type AlternativaResponse = {
  id: string;
  descricao: string;
  correta: boolean | null;
};

export type QuestaoResponse = {
  id: string;
  enunciado: string;
  valor: number;
  alternativas: AlternativaResponse[];
};

export type AtividadeResponse = {
  id: string;
  titulo: string;
  quantQuestoes: number;
  moduloId: string;
  questoes: QuestaoResponse[];
};

export type SalvarAtividadePayload = {
  titulo: string;
  questoes: {
    enunciado: string;
    valor: number;
    alternativas: { descricao: string; correta: boolean }[];
  }[];
};

export type RespostaItemResponse = {
  id: string;
  correta: boolean;
  questaoId: string;
  alternativaId: string;
};

export type TentativaResponse = {
  id: string;
  dataEnvio: string;
  pontuacaoObtida: number;
  alunoId: string;
  atividadeId: string;
  respostas: RespostaItemResponse[];
};

export type ResultadoTentativaResponse = {
  tentativa: TentativaResponse;
  tentativasUsadas: number;
  melhorPontuacao: number;
  pontosDelta: number;
  pontosTotais: number;
  concluida: boolean;
};

export type EnviarTentativaPayload = {
  respostas: { questaoId: string; alternativaId: string }[];
};

export type EstatisticaAlternativaResponse = {
  alternativaId: string;
  descricao: string;
  correta: boolean;
  letra: string;
  votos: number;
  percentual: number;
  distrator: boolean;
};

export type EstatisticaQuestaoResponse = {
  questaoId: string;
  enunciado: string;
  numero: number;
  acertoPercentual: number;
  alternativas: EstatisticaAlternativaResponse[];
};

export type MonitoramentoAlunoResponse = {
  alunoId: string;
  nome: string;
  apelido: string;
  pontos: number;
  imagemPerfil: string;
  tentativa: TentativaResponse | null;
  respostasPorQuestao: (string | null)[];
};

export type MonitoramentoResponse = {
  tamanhoTurma: number;
  envios: number;
  xpTotal: number;
  mediaPontuacao: number;
  mediaAcertoPercentual: number;
  questoes: EstatisticaQuestaoResponse[];
  alunos: MonitoramentoAlunoResponse[];
};

export type MedalhaResponse = {
  id: string;
  nome: string;
  imagemUrl: string;
  pontosMin: number;
  conquistada: boolean;
};

export type SalvarMedalhaPayload = {
  nome: string;
  imagemUrl: string;
  pontosMin: number;
};

export type RankingResponse = {
  posicao: number;
  id: string;
  nome: string;
  apelido: string;
  pontos: number;
  imagemPerfil: string;
};
