import {
  newActivitySchema,
  type NewActivityFormType,
} from '@/data/schemas/activity';
import { setNewActivityStorage } from '@/data/newActivityStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

export const useNewActivityDialog = () => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();

  const methods = useForm<NewActivityFormType>({
    resolver: zodResolver(newActivitySchema),
  });

  const handleNewActivity = (data: NewActivityFormType) => {
    setNewActivityStorage({
      activityName: data.activityName,
      qtdQuestions: data.qtdQuestions,
      messages: [],
    });
    navigate(`/cursos/${cursoId}/modulos/${moduloId}/nova-atividade`);
  };

  return { methods, handleNewActivity };
};
