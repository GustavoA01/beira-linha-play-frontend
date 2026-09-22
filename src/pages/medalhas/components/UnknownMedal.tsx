import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CircleQuestionMark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MedalhaType } from '@/data/types/api';

type UnknownMedalProps = {
  minPoints: MedalhaType['pontosMin'];
};

const MARKS = ['?', '?', '?'];

export const UnknownMedal = ({ minPoints }: UnknownMedalProps) => (
  <Card className="group h-full cursor-pointer select-none gap-2 border-2 border-dashed border-zinc-200 py-4">
    <CardContent className="flex flex-1 flex-col items-center gap-2 select-none px-3">
      <CircleQuestionMark className="size-20 shrink-0 text-zinc-400 transition-colors duration-300 group-hover:text-red-900 sm:size-15" />
      <p
        aria-hidden
        className="flex min-h-6 items-center justify-center text-lg font-bold leading-none"
      >
        {MARKS.map((mark, index) => (
          <motion.span
            key={index}
            className="inline-block"
            animate={{
              color: ['#a1a1aa', '#f59e0b', '#a1a1aa'],
              scale: [1, 1.3, 1],
              textShadow: [
                '0 0 0px rgba(245, 158, 11, 0)',
                '0 0 10px rgba(245, 158, 11, 0.85)',
                '0 0 0px rgba(245, 158, 11, 0)',
              ],
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {mark}
          </motion.span>
        ))}
      </p>
    </CardContent>
    <CardFooter className="justify-center px-3 pt-0">
      <p className="text-center text-sm text-muted-foreground">
        {minPoints} xp
      </p>
    </CardFooter>
  </Card>
);
