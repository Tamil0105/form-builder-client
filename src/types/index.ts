export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type ColorTheme = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface RoutingRule {
  sourceQuestionId: string;
  condition: 'equals' | 'notEquals' | 'contains';
  value: string;
}

export interface Question {
  id?: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  routingRule?: RoutingRule;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  fields: Question[];
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  colorTheme?: ColorTheme;
}

export interface FormResponse {
  _id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
  ipAddress: string;
}

export interface CreateFormRequest {
  title: string;
  description: string;
  fields: Question[];
  colorTheme?: ColorTheme;
}

export interface UpdateFormRequest {
  title?: string;
  description?: string;
  fields?: Question[];
  colorTheme?: ColorTheme;
}
