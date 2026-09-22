import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
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

const IMAGE_WAIT_MS = 50;

const waitForImages = async (card: HTMLElement) => {
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

const exportCardBlob = async (card: HTMLElement) => {
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
  const [ready, setReady] = useState(false);
  const preparedBlobRef = useRef<Blob | null>(null);
  const preparePromiseRef = useRef<Promise<Blob> | null>(null);
  const caption = achievementCaption(nome, level, points);

  useEffect(() => {
    preparedBlobRef.current = null;
    preparePromiseRef.current = null;
    setReady(false);

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card || cancelled) return;

      const promise = exportCardBlob(card);
      preparePromiseRef.current = promise;

      void promise
        .then((blob) => {
          if (cancelled) return;
          preparedBlobRef.current = blob;
          setReady(true);
        })
        .catch(() => {
          if (cancelled) return;
          preparedBlobRef.current = null;
          preparePromiseRef.current = null;
          setReady(false);
        });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      preparePromiseRef.current = null;
    };
  }, [cardRef, nome, level, points]);

  const resolveBlob = useCallback(async () => {
    if (preparedBlobRef.current) return preparedBlobRef.current;

    const card = cardRef.current;
    if (!card) throw new Error('Card da conquista não encontrado');

    const promise = preparePromiseRef.current ?? exportCardBlob(card);
    preparePromiseRef.current = promise;

    try {
      const blob = await promise;
      preparedBlobRef.current = blob;
      setReady(true);
      return blob;
    } catch (error) {
      preparePromiseRef.current = null;
      preparedBlobRef.current = null;
      setReady(false);
      throw error;
    }
  }, [cardRef]);

  const withCardBlob = useCallback(
    async (action: (blob: Blob) => Promise<void>) => {
      setSharing(true);
      try {
        const blob = await resolveBlob();
        await action(blob);
      } catch (error) {
        toastError(error, 'Não foi possível gerar o card da conquista');
      } finally {
        setSharing(false);
      }
    },
    [resolveBlob]
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

  return { sharing, ready, shareNative };
};
