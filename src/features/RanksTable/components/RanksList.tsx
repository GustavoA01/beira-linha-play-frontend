import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Crown, Medal } from 'lucide-react';
import { ChessQueen } from './ChessQueen';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { RankingResponseType } from '@/data/types/services';
import { forwardRef } from 'react';

const topRanksIcons = [
  <Crown className="text-emerald-500 fill-emerald-500" />,
  <ChessQueen color="gray" />,
  <Medal className="text-amber-700" />,
];

type RanksListProps = {
  ranks: RankingResponseType[];
  loggedAlunoId?: string;
  showName: boolean;
};

export const RanksList = forwardRef<HTMLTableRowElement, RanksListProps>(
  ({ ranks, loggedAlunoId, showName }, ref) => (
    <Table>
      <TableBody>
        {ranks.map(({ id, nome, apelido, pontos, posicao, imagemPerfil }) => {
          const isTopRanks = [1, 2, 3].includes(posicao);
          const isLoggedAluno = id === loggedAlunoId;
          const initials = apelido.slice(0, 2).toUpperCase();

          return (
            <TableRow
              key={id}
              ref={isLoggedAluno ? ref : undefined}
              className={cn(
                'h-12 font-montserrat',
                isLoggedAluno && 'bg-primary/10 hover:bg-primary/15'
              )}
            >
              <TableCell className="text-center w-10 font-bold text-gray-400">
                {isTopRanks ? topRanksIcons[posicao - 1] : `${posicao}°`}
              </TableCell>

              <TableCell>
                <Avatar>
                  <AvatarImage src={imagemPerfil} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell
                className={cn(
                  'font-semibold max-w-40',
                  isTopRanks || isLoggedAluno ? 'text-black' : 'text-zinc-600'
                )}
              >
                <span className="flex flex-col min-w-0">
                  <span className="truncate">{apelido}</span>
                  {showName && (
                    <span className="truncate text-xs font-medium text-muted-foreground">
                      {nome}
                    </span>
                  )}
                </span>
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={cn(
                    'font-bold',
                    posicao === 1 ? 'text-emerald-500' : 'text-blue-600'
                  )}
                >
                  {pontos}
                </span>
                <span className="font-semibold text-zinc-400">xp</span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
);

RanksList.displayName = 'RanksList';
