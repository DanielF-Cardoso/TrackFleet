export interface ManagerTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  isActive: boolean;
}

export interface ManagerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  password: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
}

export interface ManagerTableData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Inativo';
}
