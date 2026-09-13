import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CircleQuestionMark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MedalhaType } from '@/data/types/api';

type UnknownMedalProps = {
  minPoints: MedalhaType['pontosMin'];
};

const MARKS = ['?', '?', '?'];

export const UnknownMedal = ({ minPoints }: UnknownMedalProps) => (
  <Card className="group h-fit border-dashed border-2 border-zinc-200 select-none cursor-pointer">
    <CardContent className="space-y-2 select-none flex flex-col items-center">
      <CircleQuestionMark className="w-20 h-20 sm:w-15 sm:h-15 text-zinc-400 group-hover:text-red-900 transition-colors duration-300" />
      <p aria-hidden className="text-2xl font-bold flex">
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
    <CardFooter className="flex justify-center">
      <p className="text-muted-foreground text-center text-sm">
        {minPoints} xp
      </p>
    </CardFooter>
  </Card>
);
