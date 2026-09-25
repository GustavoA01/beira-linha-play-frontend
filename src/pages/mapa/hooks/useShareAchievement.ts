import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import {
  achievementCaption,
  blobToPngFile,
  canShareFiles,
  downloadBlob,
  exportCardBlob,
  isShareAbort,
  SHARE_TITLE,
} from '../utils';

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
