import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { QuizFooterPropsType } from '../../types';

export const FooterAnswering = ({
  canCheck,
  isSubmitting,
  onCheck,
}: QuizFooterPropsType) => (
  <div className="border-t bg-white px-4 py-4 sm:px-8">
    <div className="container mx-auto">
      <Button
        size="lg"
        className="h-12 w-full text-base font-bold"
        disabled={!canCheck || isSubmitting}
        onClick={onCheck}
      >
        {isSubmitting ? <Spinner /> : 'Enviar resposta'}
      </Button>
    </div>
  </div>
);
