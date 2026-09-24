import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { RankTableHeader } from '@/features/RanksTable/components/RankTableHeader';
import { RanksList } from '@/features/RanksTable/components/RanksList';
import { Spinner } from '@/components/ui/spinner';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { useRanksTable } from '../hooks/useRanksTable';

type RankTableProps = {
  floating?: boolean;
};

export const RankTable = ({ floating = true }: RankTableProps) => {
  const { isDesktop } = useMediaDevice();
  const {
    showName,
    selected,
    setSelected,
    items,
    loggedAlunoId,
    scrollToLoggedRow,
    ranks,
    isRanksLoading,
    shellClassName,
    maxHeight,
  } = useRanksTable({ floating });

  const ranksContent = isRanksLoading ? (
    <div
      role="status"
      aria-label="Carregando ranking"
      className="flex min-h-24 flex-col items-center justify-center py-6"
    >
      <Spinner className="size-6 text-primary" />
    </div>
  ) : (
    <RanksList
      ranks={ranks}
      ref={scrollToLoggedRow}
      loggedAlunoId={loggedAlunoId}
      showName={showName}
    />
  );

  if (!isDesktop) {
    return (
      <div style={{ maxHeight }} className={shellClassName}>
        <RankTableHeader
          selected={selected}
          setSelected={setSelected}
          items={items}
        />
        <div className="min-h-0 overflow-y-auto rounded-b-md bg-white scrollbar-hidden">
          {ranksContent}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxHeight }} className={shellClassName}>
      <Accordion type="single" defaultValue="ranking" collapsible>
        <AccordionItem value="ranking">
          <RankTableHeader
            isDesktop
            items={items}
            selected={selected}
            setSelected={setSelected}
          />
          <AccordionContent className="p-0">
            <div className="custom-bar max-h-56 min-h-0 overflow-y-auto rounded-b-md border bg-white">
              {ranksContent}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
