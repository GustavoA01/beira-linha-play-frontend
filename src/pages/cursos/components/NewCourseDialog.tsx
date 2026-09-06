import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { LabelInput } from '@/components/LabelInput';
import type { CursoType } from '@/data/types/api';
import { Plus, X } from 'lucide-react';
import { useNewCourseDialog } from '../hooks/useNewCourseDialog';

type NewCourseDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curso?: CursoType;
};

export const NewCourseDialog = ({
  open,
  onOpenChange,
  curso,
}: NewCourseDialogPropsType) => {
  const {
    register,
    onSubmit,
    errors,
    handleOpenChange,
    pendingMonitorId,
    setPendingMonitorId,
    addMonitor,
    removeMonitor,
    monitoresDisponiveis,
    monitoresSelecionados,
    canSubmit,
    isEditing,
  } = useNewCourseDialog(onOpenChange, curso);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar curso' : 'Novo curso'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Altere o nome ou os monitores responsáveis. Cod. ${curso?.codigoAcesso}`
              : 'Informe o nome e adicione os monitores responsáveis. O código de acesso é gerado automaticamente.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <LabelInput
            id="nome"
            label="Nome"
            autoFocus
            placeholder="Ex.: Cálculo I"
            error={errors.nome?.message}
            register={register}
          />

          <div>
            <Label htmlFor="monitorId">Monitor</Label>
            <div className="mt-1.5 flex gap-2">
              <Select
                value={pendingMonitorId || undefined}
                onValueChange={setPendingMonitorId}
                disabled={monitoresDisponiveis.length === 0}
              >
                <SelectTrigger id="monitorId" className="w-full">
                  <SelectValue
                    placeholder={
                      monitoresDisponiveis.length === 0
                        ? 'Todos os monitores já foram adicionados'
                        : 'Selecione um monitor'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {monitoresDisponiveis.map((monitor) => (
                    <SelectItem key={monitor.id} value={monitor.id}>
                      {monitor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pendingMonitorId && (
                <Button type="button" onClick={addMonitor}>
                  <Plus />
                  Adicionar monitor
                </Button>
              )}
            </div>
            {errors.monitorIds?.message && (
              <ErrorFormMessage message={errors.monitorIds.message} />
            )}
            {monitoresSelecionados.length > 0 && (
              <ul className="mt-3 space-y-2">
                {monitoresSelecionados.map((monitor) => (
                  <li
                    key={monitor.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span className="font-montserrat">{monitor.nome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remover ${monitor.nome}`}
                      onClick={() => removeMonitor(monitor.id)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {!isEditing && (
              <p className="mt-1.5 text-xs text-zinc-500">
                * Adicione monitores antes de criar o curso.
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
