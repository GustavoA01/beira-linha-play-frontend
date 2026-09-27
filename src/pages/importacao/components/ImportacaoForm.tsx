import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventoImportacaoType } from '@/data/types/services';

type ImportacaoFormProps = {
  ano: number;
  anos: number[];
  trocarAno: (ano: number) => void;
  referencia: string;
  trocarReferencia: (referencia: string) => void;
  eventos: EventoImportacaoType[];
  eventosPendentes: boolean;
  eventosComErro: boolean;
  erroReferencia?: string;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const nomeEvento = (evento: EventoImportacaoType) =>
  `${evento.nome || 'Evento sem nome'} (${evento.inicio} - ${evento.fim})`;

export const ImportacaoForm = ({
  ano,
  anos,
  trocarAno,
  referencia,
  trocarReferencia,
  eventos,
  eventosPendentes,
  eventosComErro,
  erroReferencia,
  isSubmitting,
  onSubmit,
}: ImportacaoFormProps) => (
  <form className="mt-6 max-w-xl space-y-4" onSubmit={onSubmit}>
    <div>
      <Label htmlFor="ano">Ano</Label>
      <Select
        value={ano.toString()}
        disabled={isSubmitting}
        onValueChange={(value) => trocarAno(Number(value))}
      >
        <SelectTrigger id="ano" className="mt-1.5 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {anos.map((opcao) => (
            <SelectItem key={opcao} value={opcao.toString()}>
              {opcao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="referencia">Evento</Label>
      <Select
        value={referencia}
        onValueChange={trocarReferencia}
        disabled={isSubmitting || eventosPendentes || eventos.length === 0}
      >
        <SelectTrigger id="referencia" className="mt-1.5 w-full">
          <SelectValue
            placeholder={
              eventosPendentes ? 'Carregando eventos…' : 'Selecione o evento'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {eventos.map((evento) => (
            <SelectItem key={evento.referencia} value={evento.referencia}>
              {nomeEvento(evento)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {erroReferencia && <ErrorFormMessage message={erroReferencia} />}
      {eventosComErro && (
        <p className="mt-2 font-montserrat text-sm text-destructive">
          Não foi possível carregar os eventos.
        </p>
      )}
      {!eventosPendentes && !eventosComErro && eventos.length === 0 && (
        <p className="mt-2 font-montserrat text-sm text-muted-foreground">
          Nenhum evento publicado nesse ano.
        </p>
      )}
    </div>

    <Button type="submit" disabled={isSubmitting || eventosPendentes}>
      {isSubmitting ? <Spinner /> : 'Importar'}
    </Button>
  </form>
);
