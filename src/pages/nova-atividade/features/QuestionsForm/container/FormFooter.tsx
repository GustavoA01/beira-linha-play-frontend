import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FormFooterProps = {
  isSubmitting: boolean;
};

export const FormFooter = ({ isSubmitting }: FormFooterProps) => {
  const navigate = useNavigate();

  return (
    <footer className="flex flex-col-reverse sm:flex-row w-full sm:justify-end gap-2">
      <Button
        type="button"
        onClick={() => navigate(-1)}
        variant="outline"
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
    </footer>
  );
};
