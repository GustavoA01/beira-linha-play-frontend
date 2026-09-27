export const anoAtual = new Date().getFullYear();

export const formatDate = (iso: string) => {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString('pt-BR');
};
