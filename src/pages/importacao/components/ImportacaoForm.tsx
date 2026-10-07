import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  cursos: string[];
  selecionados: string[];
  cursosPendentes: boolean;
  cursosComErro: boolean;
  alternarCurso: (nome: string) => void;
  alternarTodos: (marcar: boolean) => void;
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
  cursos,
  selecionados,
  cursosPendentes,
  cursosComErro,
  alternarCurso,
  alternarTodos,
  isSubmitting,
  onSubmit,
}: ImportacaoFormProps) => {
  const todosMarcados =
    cursos.length > 0 && selecionados.length === cursos.length;
  const mostrarCursos = referencia.trim().length > 0;

  return (
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

      {mostrarCursos && (
        <fieldset>
          <legend className="font-montserrat text-sm font-medium">
            Cursos
          </legend>
          {cursosPendentes && (
            <p className="mt-2 font-montserrat text-sm text-muted-foreground">
              Carregando cursos…
            </p>
          )}
          {cursosComErro && (
            <p className="mt-2 font-montserrat text-sm text-destructive">
              Não foi possível carregar os cursos.
            </p>
          )}
          {!cursosPendentes && !cursosComErro && cursos.length > 0 && (
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2 font-montserrat text-sm">
                <Checkbox
                  checked={
                    todosMarcados
                      ? true
                      : selecionados.length === 0
                        ? false
                        : 'indeterminate'
                  }
                  disabled={isSubmitting}
                  onCheckedChange={() => alternarTodos(!todosMarcados)}
                />
                Todos
              </label>
              {cursos.map((nome) => (
                <label
                  key={nome}
                  className="flex items-center gap-2 font-montserrat text-sm"
                >
                  <Checkbox
                    checked={selecionados.includes(nome)}
                    disabled={isSubmitting}
                    onCheckedChange={() => alternarCurso(nome)}
                  />
                  {nome}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      )}

      <Button
        type="submit"
        disabled={
          isSubmitting || eventosPendentes || cursosPendentes || cursosComErro
        }
      >
        {isSubmitting ? <Spinner /> : 'Importar'}
      </Button>
    </form>
  );
};
