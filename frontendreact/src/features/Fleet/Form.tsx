import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

const fleetSchema = z.object({
  licensePlate: z.string()
    .min(1, 'A placa é obrigatória')
    .regex(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/, 'Placa inválida'),
  model: z.string().min(1, 'O modelo é obrigatório'),
  brand: z.string().min(1, 'A marca é obrigatória'),
  year: z.string().length(4, 'Ano inválido'),
  color: z.string().min(1, 'A cor é obrigatória'),
  renavam: z.string()
    .min(1, 'O RENAVAM é obrigatório')
    .regex(/^\d{11}$/, 'RENAVAM deve ter 11 dígitos numéricos'),
  odometer: z.string().min(1, 'O odômetro é obrigatório'),
});

interface FleetFormProps {
  formData: any;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const FleetForm: React.FC<FleetFormProps> = ({ formData, handleInputChange, handleSubmit }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let numericValue = value.replace(/\D/g, '');
    if (id === 'year') {
      numericValue = numericValue.slice(0, 4);
    } else if (id === 'odometer') {
      numericValue = numericValue.slice(0, 7);
    } else if (id === 'renavam') {
      numericValue = numericValue.slice(0, 11);
    }
    handleFieldChange(id, numericValue);
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
      fleetSchema.parse(formData);
      setIsFormValid(true);
      setErrors({});
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      setIsFormValid(false);
    }
  }, [formData]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (isFormValid) {
      handleSubmit(e);
    }
  };

  const shouldShowError = (fieldName: string) => {
    return (touchedFields[fieldName] || wasSubmitted) && errors[fieldName];
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <h6 className="fw-bold mb-3 text-primary">Dados do Veículo</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label small">Placa</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('licensePlate') ? 'is-invalid' : ''}`}
              id="licensePlate"
              value={formData.licensePlate}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value.toUpperCase())}
              onBlur={() => handleBlur('licensePlate')}
              placeholder="Digite a placa"
              required
              maxLength={7}
            />
            {shouldShowError('licensePlate') && <div className="error-feedback">{errors.licensePlate}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label small">Modelo</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('model') ? 'is-invalid' : ''}`}
              id="model"
              value={formData.model}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('model')}
              placeholder="Digite o modelo"
              required
            />
            {shouldShowError('model') && <div className="error-feedback">{errors.model}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label small">Marca</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('brand') ? 'is-invalid' : ''}`}
              id="brand"
              value={formData.brand}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('brand')}
              placeholder="Digite a marca"
              required
            />
            {shouldShowError('brand') && <div className="error-feedback">{errors.brand}</div>}
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-3">
            <label className="form-label small">Ano</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('year') ? 'is-invalid' : ''}`}
              id="year"
              value={formData.year}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('year')}
              placeholder="Ex: 2024"
              required
              maxLength={4}
            />
            {shouldShowError('year') && <div className="error-feedback">{errors.year}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label small">Cor</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('color') ? 'is-invalid' : ''}`}
              id="color"
              value={formData.color}
              onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
              onBlur={() => handleBlur('color')}
              placeholder="Digite a cor"
              required
            />
            {shouldShowError('color') && <div className="error-feedback">{errors.color}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label small">RENAVAM</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('renavam') ? 'is-invalid' : ''}`}
              id="renavam"
              value={formData.renavam}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('renavam')}
              placeholder="Digite o RENAVAM"
              required
              maxLength={11}
            />
            {shouldShowError('renavam') && <div className="error-feedback">{errors.renavam}</div>}
          </div>
          <div className="col-md-3">
            <label className="form-label small">Odômetro</label>
            <input
              type="text"
              className={`form-control ${shouldShowError('odometer') ? 'is-invalid' : ''}`}
              id="odometer"
              value={formData.odometer}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('odometer')}
              placeholder="Digite o odômetro"
              required
              maxLength={7}
            />
            {shouldShowError('odometer') && <div className="error-feedback">{errors.odometer}</div>}
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
          Salvar Veículo
        </button>
      </div>
    </form>
  );
};

export default FleetForm;