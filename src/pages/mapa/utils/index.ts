import { toBlob } from 'html-to-image';

export const SHARE_TITLE = 'Beira Linha Play';
const FILE_NAME = 'conquista-beira-linha-play.png';
const IMAGE_WAIT_MS = 50;
const CARD_SIZE = 1080;

const hexAlpha = (value: number) => {
  const rounded = Math.round(Math.min(255, Math.max(0, value)));
  return rounded.toString(16).padStart(2, '0');
};

export const toGlowShadow = (color: string, strength: number) => {
  const blur = 6 + strength * 10;
  const spread = strength * 2;
  const offset = 3 + strength * 4;
  const core = hexAlpha(36 + strength * 40);
  const drop = hexAlpha(20 + strength * 28);
  return `0 0 ${blur}px ${spread}px ${color}${core}, 0 ${offset}px ${blur + 4}px ${color}${drop}`;
};

export const achievementCaption = (
  nome: string,
  level: string,
  points: number
) => `${nome} concluiu o nível ${level} no Beira Linha Play com ${points} XP.`;

export const canShareFiles = (file: File) => {
  if (typeof navigator.share !== 'function') return false;
  const data: ShareData = { files: [file], title: SHARE_TITLE };
  if (typeof navigator.canShare !== 'function') return true;
  try {
    return navigator.canShare(data);
  } catch {
    return false;
  }
};

export const blobToPngFile = (blob: Blob) =>
  new File([blob], FILE_NAME, { type: 'image/png', lastModified: Date.now() });

export const waitForImages = async (card: HTMLElement) => {
  const images = [...card.querySelectorAll('img')];
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          const done = () => resolve();
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
          // jsdom / assets ausentes: decode pode nunca resolver
          setTimeout(done, IMAGE_WAIT_MS);
        })
    )
  );
};

export const exportCardBlob = async (card: HTMLElement) => {
  // skipFonts: true — não bloquear em document.fonts.ready (trava no jsdom)
  await waitForImages(card);

  const blob = await toBlob(card, {
    width: CARD_SIZE,
    height: CARD_SIZE,
    canvasWidth: CARD_SIZE,
    canvasHeight: CARD_SIZE,
    pixelRatio: 1,
    cacheBust: false,
    skipFonts: true,
    type: 'image/png',
    style: {
      transform: 'none',
      margin: '0',
    },
  });

  if (!blob) throw new Error('Falha ao gerar o PNG da conquista');
  return blob;
};

export const downloadBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = FILE_NAME;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const isShareAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';
