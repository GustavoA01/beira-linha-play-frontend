import { useMediaDevice } from '@/hooks/useMediaDevice';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type GoBackProps = {
  to?: string;
};

export const GoBack = ({ to }: GoBackProps) => {
  const { isDesktop } = useMediaDevice();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to, { replace: true }) : navigate(-1))}
      className="flex gap-2 items-center select-none font-semibold hover:text-blue-100 max-sm:text-sm cursor-pointer"
    >
      <ChevronLeft size={!isDesktop ? 20 : 24} />
      <p className="hidden sm:block">Voltar</p>
    </button>
  );
};
