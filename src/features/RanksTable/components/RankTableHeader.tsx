import { ChevronDown, Trophy } from 'lucide-react';
import { RankFilters, type RankFilterItem } from './RankFilters';
import { AccordionTrigger } from '@/components/ui/accordion';

type RankTableHeaderProps = {
  selected: string;
  setSelected: (value: string) => void;
  items: RankFilterItem[];
  isDesktop?: boolean;
};

export const RankTableHeader = ({
  selected,
  setSelected,
  items,
  isDesktop,
}: RankTableHeaderProps) => (
  <header className="flex items-center justify-between select-none pl-2 pr-4 pt-2 pb-2 bg-primary-light rounded-md shrink-0">
    <div className="flex gap-4 items-center">
      <div className="p-2 w-10 flex justify-center bg-white/10 rounded-lg">
        <Trophy size={20} className="text-yellow-300 fill-yellow-300" />
      </div>

      <div>
        <h1 className="text-white font-bold font-montserrat">Ranking</h1>
        <p className="text-blue-200 font-semibold text-sm">
          {items.find((item) => item.id === selected)?.nome}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <RankFilters
        items={items}
        selected={selected}
        isDesktop={isDesktop}
        setSelected={setSelected}
      />

      {isDesktop && (
        <AccordionTrigger
          showChevrDownIcon={false}
          className="hover:bg-primary-dark/10 transition-all ease-in px-3 py-2 items-end border-none"
        >
          <ChevronDown size={18} className="text-blue-200 transition ease-in" />
        </AccordionTrigger>
      )}
    </div>
  </header>
);
