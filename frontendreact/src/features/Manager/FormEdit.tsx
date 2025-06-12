import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import { ManagerFormData } from './types/managerTypes';

const managerEditSchema = z.object({
  firstName: z.string()
    .min(3, "Primeiro nome deve ter no mínimo 3 letras")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Primeiro nome deve conter apenas letras"),
  lastName: z.string()
    .min(3, "Sobrenome deve ter no mínimo 3 letras")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Sobrenome deve conter apenas letras"),
  email: z.string().email("Email inválido"),
  phone: z.string()
    .regex(/^\d+$/, "Telefone deve conter apenas números")
    .length(11, "Telefone deve ter 11 dígitos"),
  zipCode: z.string()
    .regex(/^\d+$/, "CEP deve conter apenas números")
    .length(8, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string()
    .regex(/^\d+$/, "Número deve conter apenas números")
    .max(10, "Número deve ter no máximo 10 dígitos"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório")
});

interface ManagerFormEditProps {
  formData: ManagerFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const ManagerFormEdit: React.FC<ManagerFormEditProps> = ({ formData, handleInputChange, handleSubmit }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let numericValue = value.replace(/\D/g, '');

    if (id === 'phone' && numericValue.length <= 11) {
      if (numericValue.length > 2) {
        numericValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      }
      if (numericValue.length > 10) {
        numericValue = `${numericValue.slice(0, 10)}-${numericValue.slice(10)}`;
      }
    } else if (id === 'zipCode' && numericValue.length <= 8) {
      if (numericValue.length > 5) {
        numericValue = `${numericValue.slice(0, 5)}-${numericValue.slice(5)}`;
      }
    } else if (id === 'number') {
      numericValue = numericValue.slice(0, 10);
    }

    handleFieldChange(id, numericValue);
  };

  const handleLetterInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const letterValue = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    handleFieldChange(id, letterValue);
  };

  const handleFieldChange = (id: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [id]: true }));

    const event = {
      target: {
        id,
        value
      }
    } as ChangeEvent<HTMLInputElement>;
    handleInputChange(event);
  };

  const handleBlur = (fieldId: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldId]: true }));
  };

  useEffect(() => {
    try {
      const dataToValidate = {
        ...formData,
        phone: formData.phone?.replace(/\D/g, '') || '',
        zipCode: formData.zipCode?.replace(/\D/g, '') || ''
      };

      managerEditSchema.parse(dataToValidate);
      setIsFormValid(true);
      setErrors({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
        setIsFormValid(false);
      }
    }
  }, [formData]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (isFormValid) {
      handleSubmit(e);
    }
  };

  const shouldShowError = (fieldId: string) => {
    return (wasSubmitted || touchedFields[fieldId]) && errors[fieldId];
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <h6 className="fw-bold mb-3 text-primary">Dados Pessoais</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small">Primeiro Nome</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('firstName') ? 'is-invalid' : ''}`}
              id="firstName"
              value={formData.firstName}
              onChange={handleLetterInput}
              onBlur={() => handleBlur('firstName')}
              placeholder="Digite seu primeiro nome"
            />
            {shouldShowError('firstName') && <div className="error-feedback">{errors.firstName}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Sobrenome</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('lastName') ? 'is-invalid' : ''}`}
              id="lastName"
              value={formData.lastName}
              onChange={handleLetterInput}
              onBlur={() => handleBlur('lastName')}
              placeholder="Digite seu sobrenome"
            />
            {shouldShowError('lastName') && <div className="error-feedback">{errors.lastName}</div>}
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label small">Email</label>
            <input
              type="email"
              className={`form-control ${shouldShowError('email') ? 'is-invalid' : ''}`}
              id="email"
              value={formData.email}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Digite seu email"
            />
            {shouldShowError('email') && <div className="error-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Telefone</label>
            <input
              type="text"
              inputMode="tel"
              className={`form-control ${shouldShowError('phone') ? 'is-invalid' : ''}`}
              id="phone"
              value={formData.phone}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('phone')}
              placeholder="(99) 99999-9999"
              maxLength={15}
            />
            {shouldShowError('phone') && <div className="error-feedback">{errors.phone}</div>}
          </div>
        </div>
      </div>
      <hr className="my-4" />
      <div className="mb-4">
        <h6 className="fw-bold mb-3 text-primary">Endereço</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small">CEP</label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-control ${shouldShowError('zipCode') ? 'is-invalid' : ''}`}
              id="zipCode"
              value={formData.zipCode}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('zipCode')}
              placeholder="99999-999"
              maxLength={9}
            />
            {shouldShowError('zipCode') && <div className="error-feedback">{errors.zipCode}</div>}
          </div>
          <div className="col-md-8">
            <label className="form-label small">Endereço</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('street') ? 'is-invalid' : ''}`}
              id="street"
              value={formData.street}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('street')}
              placeholder="Digite seu Endereço"
            />
            {shouldShowError('street') && <div className="error-feedback">{errors.street}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label small">Número</label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-control ${shouldShowError('number') ? 'is-invalid' : ''}`}
              id="number"
              value={formData.number}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('number')}
              placeholder="Digite seu Número"
              maxLength={10}
            />
            {shouldShowError('number') && <div className="error-feedback">{errors.number}</div>}
          </div>
          <div className="col-md-8">
            <label className="form-label small">Bairro</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('district') ? 'is-invalid' : ''}`}
              id="district"
              value={formData.district}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('district')}
              placeholder="Digite seu Bairro"
            />
            {shouldShowError('district') && <div className="error-feedback">{errors.district}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Cidade</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('city') ? 'is-invalid' : ''}`}
              id="city"
              value={formData.city}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('city')}
              placeholder="Digite sua Cidade"
            />
            {shouldShowError('city') && <div className="error-feedback">{errors.city}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Estado</label>
            <select
              className={`form-control ${shouldShowError('state') ? 'is-invalid' : ''}`}
              id="state"
              value={formData.state}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('state')}
            >
              <option value="">Selecione o Estado</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            {shouldShowError('state') && <div className="error-feedback">{errors.state}</div>}
          </div>
        </div>
      </div>
      <div className="d-grid gap-2 mt-4">
        <button
          type="submit"
          className={`btn btn-lg ${isFormValid ? 'btn-primary' : 'btn-secondary'}`}
          disabled={!isFormValid}
        >
          <i className="bi bi-check-circle me-2"></i>
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};

export default ManagerFormEdit;