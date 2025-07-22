import type { Template } from '../types';

const STORAGE_KEY = 'form_templates';

export const saveTemplates = (templates: Template[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const loadTemplates = (): Template[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
