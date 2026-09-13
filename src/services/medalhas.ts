import { api } from './api';
import { deleteImage } from './cloudinary';
import { endpoints } from './endpoints';
import type {
  MedalResponseType,
  SaveMedalPayloadType,
  UserResponseType,
} from '@/data/types/services';

export const listMedals = async () => {
  const { data } = await api.get<MedalResponseType[]>(endpoints.medals.list);
  return data;
};

export const createMedal = async (payload: SaveMedalPayloadType) => {
  const { data } = await api.post<MedalResponseType>(
    endpoints.medals.list,
    payload
  );
  return data;
};

export const deleteMedal = async ({
  id,
  imagemUrl,
}: {
  id: string;
  imagemUrl: string;
}) => {
  try {
    await deleteImage(imagemUrl);
  } catch (error) {
    console.error(error);
  }
  await api.delete(endpoints.medals.byId(id));
};

export const equipMedal = async (id: string) => {
  const { data } = await api.post<UserResponseType>(endpoints.medals.equip(id));
  return data;
};
