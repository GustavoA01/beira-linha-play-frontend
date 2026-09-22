import { Skeleton } from '@/components/ui/skeleton';

const times = (count: number) =>
  Array.from({ length: count }, (_, index) => index);

export const CoursesPageSkeleton = () => (
  <div
    role="status"
    aria-label="Carregando"
    className="flex flex-col scrollbar-hidden overflow-y-auto md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-4 sm:mt-8 pb-18 pt-2 gap-4"
  >
    {times(6).map((index) => (
      <Skeleton key={index} className="h-32 w-full md:max-w-68 rounded-xl" />
    ))}
  </div>
);

export const HeaderListPageSkeleton = () => (
  <div
    role="status"
    aria-label="Carregando"
    className="flex flex-col h-dvh overflow-hidden"
  >
    <header className="bg-blue-puc rounded-b-4xl pb-14">
      <div className="px-4 pt-4 sm:px-8 sm:pt-8 container mx-auto">
        <Skeleton className="h-8 w-20 bg-white/20" />
        <Skeleton className="mt-4 h-10 w-2/3 max-w-sm bg-white/20" />
        <Skeleton className="mt-3 h-4 w-40 bg-white/20" />
      </div>
    </header>
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-4 pb-20">
      {times(4).map((index) => (
        <Skeleton key={index} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

export const QuizPageSkeleton = () => (
  <div
    role="status"
    aria-label="Carregando"
    className="flex h-dvh flex-col overflow-hidden bg-zinc-50"
  >
    <header className="bg-blue-puc">
      <div className="container mx-auto px-4 pt-4 sm:px-8 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-16 bg-white/20" />
          <Skeleton className="h-5 w-40 bg-white/20" />
          <Skeleton className="h-4 w-10 bg-white/20" />
        </div>
        <Skeleton className="mt-3 mb-4 h-3 w-full bg-white/20" />
      </div>
    </header>
    <div className="container mx-auto max-w-xl px-4 py-6 space-y-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      {times(4).map((index) => (
        <Skeleton key={index} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export const MedalsPageSkeleton = () => (
  <div
    role="status"
    aria-label="Carregando"
    className="mx-auto mt-4 grid grid-cols-2 gap-4 pb-6 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5"
  >
    {times(8).map((index) => (
      <div
        key={index}
        className="flex flex-col items-center gap-2 rounded-xl border py-4"
      >
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
    ))}
  </div>
);
