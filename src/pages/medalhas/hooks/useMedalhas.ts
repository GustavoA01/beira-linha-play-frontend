import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { useAuthUser } from '@/providers/UserProvider';
import { listMedals } from '@/services/medalhas';
import { useDeleteMedal, useSelectMedal } from './useMutation';

export const useMedalhas = () => {
  const { isAdmin } = useAuthUser();
  const { mutate: selectMedal, isPending: isSelectingMedal } = useSelectMedal();
  const {
    data: medals = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: queryClientKeys.medalKeys.all,
    queryFn: listMedals,
  });
  const { mutate: removeMedal } = useDeleteMedal();
  const [openDialog, setOpenDialog] = useState(false);

  return {
    isAdmin,
    selectMedal,
    isSelectingMedal,
    medals,
    isPending,
    isError,
    removeMedal,
    openDialog,
    setOpenDialog,
  };
};
