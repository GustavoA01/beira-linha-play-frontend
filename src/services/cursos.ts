import { api } from './api';
import { endpoints } from './endpoints';
import type {
  CourseResponseType,
  EnrollCoursePayloadType,
  SaveCoursePayloadType,
} from '@/data/types/services';

export const listCourses = async () => {
  const { data } = await api.get<CourseResponseType[]>(endpoints.courses.list);
  return data;
};

export const getCourse = async (id: string) => {
  const { data } = await api.get<CourseResponseType>(
    endpoints.courses.byId(id)
  );
  return data;
};

export const createCourse = async (payload: SaveCoursePayloadType) => {
  const { data } = await api.post<CourseResponseType>(
    endpoints.courses.list,
    payload
  );
  return data;
};

export const updateCourse = async (
  id: string,
  payload: SaveCoursePayloadType
) => {
  const { data } = await api.patch<CourseResponseType>(
    endpoints.courses.byId(id),
    payload
  );
  return data;
};

export const deleteCourse = async (id: string) => {
  await api.delete(endpoints.courses.byId(id));
};

export const enrollCourse = async (
  id: string,
  payload: EnrollCoursePayloadType
) => {
  const { data } = await api.post<CourseResponseType>(
    endpoints.courses.enroll(id),
    payload
  );
  return data;
};
