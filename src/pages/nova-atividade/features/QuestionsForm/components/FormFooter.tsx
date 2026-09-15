import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FormFooterProps = {
  isSubmitting: boolean;
};

export const FormFooter = ({ isSubmitting }: FormFooterProps) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-col sm:flex-row w-full sm:justify-end gap-2">
      <Button
        type="button"
        onClick={goBack}
        variant="outline"
        className="max-sm:hidden"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Spinner />
        ) : (
          <>
            <Save className="max-sm:hidden" />
            Salvar
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={goBack}
        variant="outline"
        className="sm:hidden"
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
    </div>
  );
};
