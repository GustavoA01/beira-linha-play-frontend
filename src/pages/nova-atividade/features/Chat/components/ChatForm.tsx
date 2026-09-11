import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SendHorizonal } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { KeyboardEvent } from 'react';

type ChatFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  canSend: boolean;
  register: UseFormRegister<{
    message: string;
  }>;
  handleOnKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const ChatForm = ({
  onSubmit,
  register,
  isLoading,
  canSend,
  handleOnKeyDown,
}: ChatFormProps) => (
  <form
    onSubmit={onSubmit}
    className="px-3 pt-3 max-md:pb-[calc(env(safe-area-inset-bottom)+16px)]"
  >
    <div
      className={cn(
        'flex items-end gap-2 rounded-full border border-zinc-200 bg-zinc-100 pl-4 pr-1.5 py-1.5',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-zinc-300 focus-within:bg-zinc-50'
      )}
    >
      <Textarea
        disabled={isLoading}
        onKeyDown={handleOnKeyDown}
        rows={1}
        {...register('message')}
        className={cn(
          'min-h-9 max-h-32 flex-1 resize-none border-0 bg-transparent px-0 py-2 shadow-none',
          'focus-visible:border-0 focus-visible:ring-0 md:text-sm'
        )}
        placeholder={
          isLoading
            ? 'Aguarde a resposta...'
            : 'Crie perguntas de três níveis sobre...'
        }
      />
      <Button
        type="submit"
        size="icon"
        disabled={!canSend || isLoading}
        aria-label="Enviar"
        className={cn(
          'mb-0.5 size-9 shrink-0 rounded-full transition-all',
          canSend && !isLoading
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-zinc-300 text-zinc-500 opacity-60'
        )}
      >
        {isLoading ? <Spinner /> : <SendHorizonal />}
      </Button>
    </div>
  </form>
);
