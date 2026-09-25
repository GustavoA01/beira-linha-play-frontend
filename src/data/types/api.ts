export interface UsuarioBaseType {
  id: string;
  nome: string;
  cursoIds: string[];
}

export interface AlunoType extends UsuarioBaseType {
  tipo: 'ALUNO';
  apelido: string;
  pontos: number;
  imagemPerfil: string;
}

export interface MonitorType extends UsuarioBaseType {
  tipo: 'MONITOR';
  email: string;
  cursoOrigem?: string | null;
}

export interface AdminType extends Omit<UsuarioBaseType, 'cursoIds'> {
  tipo: 'ADMIN';
}

export type UsuarioType = AlunoType | MonitorType | AdminType;

export interface MedalhaType {
  id: string;
  nome: string;
  imagemUrl: string;
  pontosMin: number;
}

export interface CursoType {
  id: string;
  nome: string;
  codigoAcesso: string;
  monitorIds: string[];
  monitorNomes?: string[];
  modulos: ModuloType[];
}

export interface ModuloType {
  id: string;
  nome: string;
  cursoId: string;
  atividades: AtividadeType[];
}

export interface AtividadeType {
  id: string;
  titulo: string;
  quantQuestoes: number;
  moduloId: string;
  questoes: QuestaoType[];
}

export interface QuestaoType {
  id: string;
  enunciado: string;
  valor: number;
  alternativas: AlternativaType[];
}

// null quando a API omite o gabarito para o aluno.
export interface AlternativaType {
  id: string;
  descricao: string;
  correta: boolean | null;
}

export interface TentativaType {
  id: string;
  dataEnvio: string;
  pontuacaoObtida: number;
  alunoId: string;
  atividadeId: string;
  respostas: RespostaType[];
}

export interface RespostaType {
  id: string;
  correta: boolean;
  questaoId: string;
  alternativaId: string;
}
