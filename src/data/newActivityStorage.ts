import type { NewActivityFormType, QuestionFormType } from './schemas/activity';

export const NEW_ACTIVITY_STORAGE_KEY = 'newActivityData';

export type NewActivityChatMessageType = {
  role: 'user' | 'assistant';
  content: string;
  questions?: QuestionFormType['questions'];
};

export type NewActivityStorageType = NewActivityFormType & {
  messages: NewActivityChatMessageType[];
};

export const getNewActivityStorage = (): NewActivityStorageType | null => {
  const raw = localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as Partial<NewActivityStorageType>;
    if (!data || typeof data !== 'object') return null;

    return {
      activityName: data.activityName ?? '',
      qtdQuestions: data.qtdQuestions ?? 0,
      messages: Array.isArray(data.messages) ? data.messages : [],
    };
  } catch {
    return null;
  }
};

export const setNewActivityStorage = (data: NewActivityStorageType) => {
  localStorage.setItem(NEW_ACTIVITY_STORAGE_KEY, JSON.stringify(data));
};

export const clearNewActivityStorage = () => {
  localStorage.removeItem(NEW_ACTIVITY_STORAGE_KEY);
};

export const setNewActivityChatMessages = (
  messages: NewActivityChatMessageType[]
) => {
  const current = getNewActivityStorage();
  if (!current) return;
  setNewActivityStorage({ ...current, messages });
};
