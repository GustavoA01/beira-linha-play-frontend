import {
  questionFormSchema,
  type QuestionFormType,
} from '@/data/schemas/activity';
import {
  clearNewActivityStorage,
  getNewActivityStorage,
  type NewActivityStorageType,
} from '@/data/newActivityStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

export const useNewActivity = () => {
  const [localStorageActivityData, setLocalStorageActivityData] =
    useState<NewActivityStorageType | null>(null);

  const methods = useForm<QuestionFormType>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { questions: [] },
  });
  const { reset, control } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    const newActivityData = getNewActivityStorage();

    if (!newActivityData) {
      setLocalStorageActivityData(null);
      return;
    }

    setLocalStorageActivityData(newActivityData);

    reset({
      questions: Array.from({
        length: newActivityData.qtdQuestions ?? 0,
      }).map(() => ({
        statement: '',
        xp: 1,
        alternatives: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      })),
    });
  }, [reset]);

  const handleCreateActivity = (data: QuestionFormType) => {
    const questionsFormatted = data.questions.map((question) => {
      const filteredAlternatives = question.alternatives.filter(
        (alt) => alt.text !== 'ignore'
      );
      return {
        ...question,
        alternatives: filteredAlternatives,
      };
    });

    const totalXp = questionsFormatted.reduce(
      (acc, question) => question.xp + acc,
      0
    );

    const activityData = {
      ...localStorageActivityData,
      totalXp,
      questions: questionsFormatted,
    };

    clearNewActivityStorage()

    console.log(activityData);
  };

  return {
    localStorageActivityData,
    methods,
    fields,
    handleCreateActivity,
  };
};
