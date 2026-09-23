import { useMediaDevice } from '@/hooks/useMediaDevice';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type GoBackProps = {
  to?: string;
  onLeave?: () => boolean | Promise<boolean>;
};

export const GoBack = ({ to, onLeave }: GoBackProps) => {
  const { isDesktop } = useMediaDevice();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (onLeave && (await onLeave()) === false) return;
    if (to) navigate(to, { replace: true });
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex gap-2 items-center select-none font-semibold hover:text-blue-100 max-sm:text-sm cursor-pointer"
    >
      <ChevronLeft size={!isDesktop ? 20 : 24} />
      <p className="hidden sm:block">Voltar</p>
    </button>
  );
};
