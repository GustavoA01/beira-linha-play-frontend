import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LabelInput } from '@/components/LabelInput';
import { Input } from '@/components/ui/input';
import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Spinner } from '@/components/ui/spinner';
import { useAddMedalDialog } from '../hooks/useAddMedalDialog';

type AddMedalDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddMedalDialog = ({
  open,
  onOpenChange,
}: AddMedalDialogPropsType) => {
  const {
    register,
    onSubmit,
    errors,
    isSubmitting,
    handleOpenChange,
    isDragging,
    setIsDragging,
    handleImageDrop,
    handleImageChange,
    imageName,
    imageSizeError,
    imagePreview,
  } = useAddMedalDialog(onOpenChange);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar medalha</DialogTitle>
          <DialogDescription>
            Cadastre uma medalha do catálogo com nome, pontos mínimos e imagem.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <LabelInput
            label="Nome"
            id="nome"
            autoFocus
            placeholder="Ex.: PUC Minas"
            error={errors.nome?.message}
            register={register}
            disabled={isSubmitting}
          />
          <LabelInput
            label="Pontos mínimos"
            id="pontosMin"
            type="number"
            min={0}
            placeholder="0"
            error={errors.pontosMin?.message}
            register={register}
            registerOptions={{ setValueAs: Number }}
            disabled={isSubmitting}
          />
          <div
            role="button"
            tabIndex={isSubmitting ? -1 : 0}
            aria-disabled={isSubmitting}
            aria-label="Enviar imagem da medalha"
            className={`cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
            onClick={(event) => {
              if (isSubmitting || event.target instanceof HTMLInputElement)
                return;
              event.currentTarget
                .querySelector<HTMLInputElement>('input[type=file]')
                ?.click();
            }}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!isSubmitting) event.currentTarget.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isSubmitting) setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setIsDragging(false);
              }
            }}
            onDrop={handleImageDrop}
          >
            <p className="mb-3 text-sm text-muted-foreground">
              {isDragging && 'Solte a imagem aqui'}
              {!imagePreview && 'Clique aqui ou arraste uma imagem para cá.'}
            </p>
            <Input
              id="imagem"
              aria-label="Imagem"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="hidden"
            />
            {(imageSizeError || errors.imagem?.message) && (
              <div role="alert">
                <ErrorFormMessage
                  message={imageSizeError || errors.imagem!.message!}
                />
              </div>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Prévia da medalha"
                className="mx-auto mt-3 h-32 w-32 rounded-lg bg-muted object-contain p-2"
              />
            )}
            <p
              className="mt-2 text-xs text-muted-foreground"
              aria-live="polite"
            >
              {imageName
                ? `Imagem selecionada: ${imageName}`
                : 'Imagem de até 2 MB.'}
            </p>
          </div>

          {errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Enviando...
                </>
              ) : (
                'Adicionar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
