export interface DriverTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cnh: string;
  cnhType: "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";
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

export interface DriverFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cnh: string;
  cnhType: "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
}

export interface DriverTableData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cnh: string;
  cnhType: "A" | "B" | "C" | "D" | "E" | "AB" | "AC" | "AD" | "AE";
  status: 'Ativo' | 'Inativo';
}