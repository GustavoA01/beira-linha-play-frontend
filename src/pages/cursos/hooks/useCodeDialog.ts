import {
  courseCodeSchema,
  type CourseCodeFormType,
} from '@/data/schemas/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCodeDialog = (
  onOpenChange: (open: boolean) => void,
  onSubmit: (code: string) => string | void | Promise<string | void>
) => {
  const methods = useForm<CourseCodeFormType>({
    resolver: zodResolver(courseCodeSchema),
    defaultValues: { code: '' },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) methods.reset();
    onOpenChange(nextOpen);
  };

  const submitCode = methods.handleSubmit(async ({ code }) => {
    const submitError = await onSubmit(code);
    if (submitError) {
      methods.setError('code', { message: submitError });
      return;
    }
    handleOpenChange(false);
  });

  return {
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting,
    submitCode,
    handleOpenChange,
  };
};
