import { DialogClose } from '@/components/ui/dialog';

type ModalFooterProps = {
  concluded: boolean;
  showProgress?: boolean;
  minPoints?: number;
};

export const ModalFooter = ({
  concluded,
  showProgress = true,
  minPoints,
}: ModalFooterProps) => (
  <>
    <p className="mt-8 mb-8 text-zinc-500 font-medium font-fredoka text-center">
      {showProgress
        ? concluded
          ? 'Parabéns! Você concluiu a fase com sucesso!'
          : 'Você está indo bem! Continue fazendo as atividades da disciplina para preencher a barra e liberar o próximo nível.'
        : `Os alunos liberam esta fase ao alcançar ${minPoints} pontos.`}
    </p>

    <DialogClose
      className={`flex font-fredoka justify-center mx-auto font-medium py-4 rounded-md w-40 border bg-cyan-50 hover:bg-zinc-100`}
    >
      {showProgress && concluded ? 'Legal!' : 'Voltar'}
    </DialogClose>
  </>
);
