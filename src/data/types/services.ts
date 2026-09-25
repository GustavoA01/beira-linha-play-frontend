import type {
  AdminType,
  AlunoType,
  AlternativaType,
  AtividadeType,
  CursoType,
  MedalhaType,
  ModuloType,
  MonitorType,
  QuestaoType,
  RespostaType,
  TentativaType,
  UsuarioType,
} from './api';

export type UserResponseType = {
  id: string;
  nome: string;
  tipo: UsuarioType['tipo'];
  cursoIds: string[];
  email: string | null;
  apelido: string | null;
  pontos: number | null;
  imagemPerfil: string | null;
  cursoOrigem: string | null;
};

export type LoginPayloadType = {
  tipo: UsuarioType['tipo'];
  senha: string;
  apelido?: string;
  email?: string;
  nome?: string;
};

export type RegisterPayloadType = {
  tipo: Extract<UsuarioType['tipo'], 'ALUNO' | 'MONITOR'>;
  nome: string;
  senha: string;
  apelido?: string;
  email?: string;
};

export type UpdateAccountPayloadType = Partial<
  Pick<AlunoType, 'nome' | 'apelido'> &
    Pick<MonitorType, 'email'> & { senha: string }
>;

export type CreateAdminPayloadType = Pick<AdminType, 'nome'> & {
  senha: string;
};

export type ActivitySummaryResponseType = Pick<
  AtividadeType,
  'id' | 'titulo' | 'quantQuestoes' | 'moduloId'
> & {
  xpTotal?: number;
  xp?: number;
  valorTotal?: number;
  questoes?: QuestionResponseType[];
};

export type ModuleResponseType = Omit<ModuloType, 'atividades'> & {
  atividades: ActivitySummaryResponseType[];
  xpTotal?: number;
};

export type CourseModuleResponseType = Pick<
  ModuloType,
  'id' | 'nome' | 'cursoId'
> & {
  quantAtividades?: number;
  quantidadeAtividades?: number;
  xpTotal?: number;
  atividades?: ActivitySummaryResponseType[];
};

export type CourseResponseType = Omit<CursoType, 'codigoAcesso' | 'modulos'> & {
  codigoAcesso: string | null;
  monitorNomes?: string[];
  modulos: CourseModuleResponseType[];
};

export type SaveCoursePayloadType = Pick<CursoType, 'nome' | 'monitorIds'>;
export type EnrollCoursePayloadType = Pick<CursoType, 'codigoAcesso'>;
export type SaveModulePayloadType = Pick<ModuloType, 'nome'>;
export type AlternativeResponseType = Omit<AlternativaType, 'correta'> & {
  correta: boolean | null;
};

export type QuestionResponseType = Omit<QuestaoType, 'alternativas'> & {
  alternativas: AlternativeResponseType[];
};

export type ActivityResponseType = Omit<AtividadeType, 'questoes'> & {
  questoes: QuestionResponseType[];
};

export type SaveActivityPayloadType = {
  titulo: AtividadeType['titulo'];
  questoes: {
    enunciado: QuestaoType['enunciado'];
    valor: QuestaoType['valor'];
    alternativas: Pick<AlternativaType, 'descricao' | 'correta'>[];
  }[];
};

export type GenerateQuestionsPayloadType = {
  mensagem: string;
  quantidadeQuestoes?: number;
};

export type GenerateQuestionsResponseType = {
  questoes: SaveActivityPayloadType['questoes'];
};

export type AttemptResultResponseType = {
  tentativa: TentativaType;
  tentativasUsadas: number;
  melhorPontuacao: number;
  pontosDelta: number;
  pontosTotais: number;
  concluida: boolean;
};

export type SubmitAttemptPayloadType = {
  respostas: Pick<RespostaType, 'questaoId' | 'alternativaId'>[];
};

export type AlternativeStatsResponseType = {
  alternativaId: string;
  descricao: AlternativaType['descricao'];
  correta: AlternativaType['correta'];
  letra: string;
  votos: number;
  percentual: number;
  distrator: boolean;
};

export type QuestionStatsResponseType = {
  questaoId: string;
  enunciado: QuestaoType['enunciado'];
  numero: number;
  acertoPercentual: number;
  alternativas: AlternativeStatsResponseType[];
};

export type MonitoringStudentResponseType = Pick<
  AlunoType,
  'nome' | 'apelido' | 'pontos' | 'imagemPerfil'
> & {
  alunoId: string;
  tentativa: TentativaType | null;
  respostasPorQuestao: (string | null)[];
};

export type MonitoringResponseType = {
  tamanhoTurma: number;
  envios: number;
  xpTotal: number;
  mediaPontuacao: number;
  mediaAcertoPercentual: number;
  questoes: QuestionStatsResponseType[];
  alunos: MonitoringStudentResponseType[];
};

export type MedalResponseType = MedalhaType & { conquistada: boolean };
export type SaveMedalPayloadType = Omit<MedalhaType, 'id'>;
export type DeleteMedalPayloadType = {
  id: string;
  imagemUrl: string;
};

export type RankingResponseType = Pick<
  AlunoType,
  'id' | 'nome' | 'apelido' | 'pontos' | 'imagemPerfil'
> & {
  posicao: number;
};

export type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message: string };
};

export type CloudinaryDestroyResponse = {
  result?: string;
  error?: { message: string };
};
