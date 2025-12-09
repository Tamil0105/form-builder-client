import api from './api';
import type { Form, CreateFormRequest, UpdateFormRequest, FormResponse } from '../types';

export const formsService = {
  createForm: async (data: CreateFormRequest): Promise<Form> => {
    const response = await api.post<Form>('/forms', data);
    return response.data;
  },

  getUserForms: async (): Promise< Form[]> => {
    const response = await api.get<{forms: Form[]}>('/forms');
    return response.data.forms;
  },

  getForm: async (id: string): Promise<{form: Form}> => {
    const response = await api.get<{form: Form}>(`/forms/${id}`);
    console.log("response",response.data);
    return response.data
  },

  updateForm: async (id: string, data: UpdateFormRequest): Promise<Form> => {
    const response = await api.put<Form>(`/forms/${id}`, data);
    return response.data;
  },

  deleteForm: async (id: string): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },

  publishForm: async (id: string): Promise<Form> => {
    const response = await api.post<Form>(`/forms/${id}/publish`);
    return response.data;
  },

  unpublishForm: async (id: string): Promise<Form> => {
    const response = await api.post<Form>(`/forms/${id}/unpublish`);
    return response.data;
  },

  getFormResponses: async (id: string): Promise<{responses: FormResponse[]}> => {
    const response = await api.get<{responses: FormResponse[]}>(`/forms/${id}/responses`);
    return response.data;
  },

  getPublicForm: async (id: string): Promise<{form: Form}> => {
    const response = await api.get<{form: Form}>(`/forms/public/${id}`);
    return response.data;
  },

  submitResponse: async (id: string, responses: Record<string, any>): Promise<any> => {
    const response = await api.post(`/forms/public/${id}/submit`, { responses });
    return response.data;
  },
};
