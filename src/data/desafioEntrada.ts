const CHAVE = 'blp-desafio-entrada';

export const desafioEntradaConfirmada = () =>
  sessionStorage.getItem(CHAVE) === '1';

export const confirmarEntradaDesafio = () => {
  sessionStorage.setItem(CHAVE, '1');
};

export const limparEntradaDesafio = () => {
  sessionStorage.removeItem(CHAVE);
};
