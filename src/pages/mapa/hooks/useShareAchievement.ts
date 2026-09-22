import { useCallback, useEffect, useState, type RefObject } from 'react';
import { toBlob } from 'html-to-image';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';

const CARD_SIZE = 1080;
const FILE_NAME = 'conquista-beira-linha-play.png';
const SHARE_TITLE = 'Beira Linha Play';

export const achievementCaption = (
  nome: string,
  level: string,
  points: number
) => `${nome} concluiu o nível ${level} no Beira Linha Play com ${points} XP.`;

const canShareFiles = (file: File) => {
  if (typeof navigator.share !== 'function') return false;
  const data: ShareData = { files: [file], title: SHARE_TITLE };
  if (typeof navigator.canShare !== 'function') return true;
  try {
    return navigator.canShare(data);
  } catch {
    return false;
  }
};

const blobToPngFile = (blob: Blob) =>
  new File([blob], FILE_NAME, { type: 'image/png', lastModified: Date.now() });

const waitForImages = async (card: HTMLElement) => {
  const images = [...card.querySelectorAll('img')];
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      if (typeof image.decode === 'function') {
        return image.decode().catch(() => undefined);
      }
      return Promise.resolve();
    })
  );
};

const exportCardBlob = async (card: HTMLElement) => {
  if (document.fonts?.ready) await document.fonts.ready;
  await waitForImages(card);

  const blob = await toBlob(card, {
    width: CARD_SIZE,
    height: CARD_SIZE,
    canvasWidth: CARD_SIZE,
    canvasHeight: CARD_SIZE,
    pixelRatio: 1,
    cacheBust: true,
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

const downloadBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = FILE_NAME;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

const isShareAbort = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

export const useShareAchievement = (
  cardRef: RefObject<HTMLDivElement | null>,
  nome: string,
  level: string,
  points: number
) => {
  const [sharing, setSharing] = useState(false);
  const [preparedBlob, setPreparedBlob] = useState<Blob | null>(null);
  const caption = achievementCaption(nome, level, points);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      void exportCardBlob(card)
        .then((blob) => {
          if (!cancelled) setPreparedBlob(blob);
        })
        .catch(() => {
          if (!cancelled) setPreparedBlob(null);
        });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [cardRef, nome, level, points]);

  const withCardBlob = useCallback(
    async (action: (blob: Blob) => Promise<void>) => {
      const card = cardRef.current;
      if (!card) return;

      setSharing(true);
      try {
        const blob = preparedBlob ?? (await exportCardBlob(card));
        if (!preparedBlob) setPreparedBlob(blob);
        await action(blob);
      } catch (error) {
        toastError(error, 'Não foi possível gerar o card da conquista');
      } finally {
        setSharing(false);
      }
    },
    [cardRef, preparedBlob]
  );

  const shareNative = useCallback(() => {
    void withCardBlob(async (blob) => {
      const file = blobToPngFile(blob);
      try {
        if (canShareFiles(file)) {
          await navigator.share({
            files: [file],
            title: SHARE_TITLE,
            text: caption,
          });
          return;
        }
      } catch (error) {
        if (isShareAbort(error)) return;
      }

      downloadBlob(blob);
      toast.add({ type: 'success', title: 'Imagem baixada.' });
    });
  }, [caption, withCardBlob]);

  return { sharing, shareNative };
};
