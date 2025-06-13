import { z } from 'zod';
import { isValidCNH, isValidPhone } from './helpers';

export const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number()
    .min(1950, 'Year must be at least 1950')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  color: z.string().min(1, 'Color is required'),
  licensePlate: z
    .string()
    .min(1, 'License plate is required')
    .regex(/^[A-Z0-9]{6,8}$/, 'Invalid license plate format'),
  odometer: z.number().min(0, 'Odometer cannot be negative'),
  renavam: z
    .string()
    .min(1, 'RENAVAM is required')
    .regex(/^\d{11}$/, 'RENAVAM must be 11 digits'),
  status: z.enum(['active', 'inactive', 'maintenance']),
});

export const managerSchema = z.object({
  firstName: z.string().min(2, 'Nome obrigatório'),
  lastName: z.string().min(2, 'Sobrenome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha obrigatória'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.coerce.number().min(1, 'Número obrigatório'),
  district: z.string().min(2, 'Bairro obrigatório'),
  zipCode: z.string().min(5, 'CEP obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
});


export const updateManagerSchema = z.object({
  firstName: z.string().min(2, 'Nome obrigatório'),
  lastName: z.string().min(2, 'Sobrenome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.coerce.number().min(1, 'Número obrigatório'),
  district: z.string().min(2, 'Bairro obrigatório'),
  zipCode: z.string().min(5, 'CEP obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
});


export const updateDriverSchema = z.object({
  firstName: z.string().min(2, 'Nome obrigatório'),
  lastName: z.string().min(2, 'Sobrenome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string()
  .min(10, 'Telefone inválido')
  .refine(isValidPhone, { message: 'Telefone inválido' }),
  cnh: z.string()
    .min(11, 'CNH deve ter 11 dígitos')
    .refine(isValidCNH, { message: 'CNH inválida' }), 
  cnhType: z.enum(['A', 'B', 'C', 'D', 'E'], { required_error: 'Tipo de CNH obrigatório' }),
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.coerce.number().min(1, 'Número é obrigatório'),
  district: z.string().min(2, 'Bairro obrigatório'),
  zipCode: z.string().min(5, 'CEP obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
});

export const createDriverSchema = z.object({
  firstName: z.string().min(1, 'Primeiro nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  email: z.string().email('Email inválido'),
  cnh: z.string()
    .min(11, 'CNH deve ter 11 dígitos')
    .refine(isValidCNH, { message: 'CNH inválida' }),
  cnhType: z.enum(['A', 'B', 'C', 'D', 'E'], { required_error: 'Tipo de CNH obrigatório' }),
  phone: z.string()
  .min(10, 'Telefone inválido')
  .refine(isValidPhone, { message: 'Telefone inválido' }),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.coerce.number().min(1, 'Número é obrigatório'),
  district: z.string().min(1, 'Bairro é obrigatório'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
});

export const createVehicleSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z.string().min(4, 'Ano inválido').max(4, 'Ano inválido'),
  color: z.string().min(1, 'Cor é obrigatória'),
  licensePlate: z.string().min(7, 'Placa inválida').max(8, 'Placa inválida'),
  odometer: z.string().min(1, 'Odômetro é obrigatório'),
  renavam: z.string().min(11, 'Renavam inválido').max(11, 'Renavam inválido'),
});


export const editVehicleSchema = z.object({
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z.string().min(4, 'Ano inválido').max(4, 'Ano inválido'),
  color: z.string().min(1, 'Cor é obrigatória'),
  licensePlate: z.string().min(7, 'Placa inválida').max(8, 'Placa inválida'),
  odometer: z.string().min(1, 'Odômetro é obrigatório'),
  renavam: z.string().min(11, 'Renavam inválido').max(11, 'Renavam inválido'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type CarFormData = z.infer<typeof carSchema>;