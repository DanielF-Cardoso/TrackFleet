import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

const eventSchema = z.object({
  carId: z.string().min(1, 'O veículo é obrigatório'),
  driverId: z.string().min(1, 'O motorista é obrigatório'),
  odometer: z.string().min(1, 'O odômetro é obrigatório'),
});

interface CarOption {
  id: string;
  label: string; 
}
interface DriverOption {
  id: string;
  label: string;
}

interface EventFormProps {
  formData: {
    carId: string;
    driverId: string;
    odometer: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  cars: CarOption[];
  drivers: DriverOption[];
}

const EventForm: React.FC<EventFormProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
  cars,
  drivers,
}) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numericValue = value.replace(/\D/g, '').slice(0, 7);
    handleFieldChange(id, numericValue);
  };

  const handleFieldChange = (id: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [id]: true }));
    const event = {
      target: {
        id,
        value,
      },
    } as ChangeEvent<HTMLInputElement>;
    handleInputChange(event);
  };

  const handleBlur = (fieldId: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldId]: true }));
  };

  useEffect(() => {
    try {
      eventSchema.parse(formData);
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
        <h6 className="fw-bold mb-3 text-primary">Dados do Evento</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small">Motorista</label>
            <select
              className={`form-select ${shouldShowError('driverId') ? 'is-invalid' : ''}`}
              id="driverId"
              value={formData.driverId}
              onChange={e => handleFieldChange('driverId', e.target.value)}
              onBlur={() => handleBlur('driverId')}
              required
            >
              <option value="">Selecione o motorista</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.label}
                </option>
              ))}
            </select>
            {shouldShowError('driverId') && <div className="invalid-feedback">{errors.driverId}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Veículo</label>
            <select
              className={`form-select ${shouldShowError('carId') ? 'is-invalid' : ''}`}
              id="carId"
              value={formData.carId}
              onChange={e => handleFieldChange('carId', e.target.value)}
              onBlur={() => handleBlur('carId')}
              required
            >
              <option value="">Selecione o veículo</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.label}
                </option>
              ))}
            </select>
            {shouldShowError('carId') && <div className="invalid-feedback">{errors.carId}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label small">Odômetro</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              className={`form-control ${shouldShowError('odometer') ? 'is-invalid' : ''}`}
              id="odometer"
              value={formData.odometer}
              onChange={handleNumericInput}
              onBlur={() => handleBlur('odometer')}
              placeholder="Digite o odômetro"
              required
              maxLength={7}
            />
            {shouldShowError('odometer') && <div className="invalid-feedback">{errors.odometer}</div>}
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
          Salvar Evento
        </button>
      </div>
    </form>
  );
};

export default EventForm;