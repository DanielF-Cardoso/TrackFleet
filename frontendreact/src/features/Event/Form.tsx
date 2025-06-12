import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

const eventSchema = z.object({
  motorista: z.string().min(1, 'O motorista é obrigatório'),
  veiculo: z.string().min(1, 'O veículo é obrigatório'),
  tipo: z.string().min(1, 'O tipo é obrigatório'),
  dataInicio: z.string().min(1, 'A data inicial é obrigatória'),
  dataFim: z.string().optional(),
  kmInicial: z.string().min(1, 'A quilometragem inicial é obrigatória'),
  kmFinal: z.string().optional(),
  destino: z.string().min(1, 'O destino é obrigatório'),
  observacoes: z.string().optional(),
});

interface EventFormProps {
  formData: any;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const EventForm: React.FC<EventFormProps> = ({ formData, handleInputChange, handleSubmit }) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let numericValue = value.replace(/\D/g, '');
    if (id === 'kmInicial' || id === 'kmFinal') {
      numericValue = numericValue.slice(0, 7);
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
      // Validações extras além do Zod
      if (formData.kmFinal && formData.kmInicial && parseInt(formData.kmFinal) <= parseInt(formData.kmInicial)) {
        throw { errors: [{ path: ['kmFinal'], message: 'A quilometragem final deve ser maior que a inicial' }] };
      }
      if (formData.dataFim && formData.dataInicio && formData.dataFim < formData.dataInicio) {
        throw { errors: [{ path: ['dataFim'], message: 'A data final deve ser maior que a inicial' }] };
      }
      // Validação Zod
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
    <form onSubmit={onSubmit} className="motorista-form">
      <div className="mb-4">
        <div className="bg-primary rounded-top p-2">
          <span className="text-white">Dados do Evento</span>
        </div>
        <div className="p-3 border border-top-0 rounded-bottom">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small">Motorista</label>
              <input
                type="text"
                className={`form-control ${shouldShowError('motorista') ? 'is-invalid' : ''}`}
                id="motorista"
                value={formData.motorista}
                onChange={(e) => handleFieldChange('motorista', e.target.value)}
                onBlur={() => handleBlur('motorista')}
                placeholder="Selecione o motorista"
                required
              />
              {shouldShowError('motorista') && <div className="invalid-feedback">{errors.motorista}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Veículo</label>
              <input
                type="text"
                className={`form-control ${shouldShowError('veiculo') ? 'is-invalid' : ''}`}
                id="veiculo"
                value={formData.veiculo}
                onChange={(e) => handleFieldChange('veiculo', e.target.value)}
                onBlur={() => handleBlur('veiculo')}
                placeholder="Selecione o veículo"
                required
              />
              {shouldShowError('veiculo') && <div className="invalid-feedback">{errors.veiculo}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Tipo</label>
              <select
                className={`form-select ${shouldShowError('tipo') ? 'is-invalid' : ''}`}
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
                onBlur={() => handleBlur('tipo')}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="Entrega">Entrega</option>
                <option value="Coleta">Coleta</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Outro">Outro</option>
              </select>
              {shouldShowError('tipo') && <div className="invalid-feedback">{errors.tipo}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Data Inicial</label>
              <input
                type="date"
                className={`form-control ${shouldShowError('dataInicio') ? 'is-invalid' : ''}`}
                id="dataInicio"
                value={formData.dataInicio}
                onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
                onBlur={() => handleBlur('dataInicio')}
                required
              />
              {shouldShowError('dataInicio') && <div className="invalid-feedback">{errors.dataInicio}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Data Final</label>
              <input
                type="date"
                className={`form-control ${shouldShowError('dataFim') ? 'is-invalid' : ''}`}
                id="dataFim"
                value={formData.dataFim}
                onChange={(e) => handleFieldChange(e.target.id, e.target.value)}
                onBlur={() => handleBlur('dataFim')}
              />
              {shouldShowError('dataFim') && <div className="invalid-feedback">{errors.dataFim}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Quilometragem Inicial</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                className={`form-control ${shouldShowError('kmInicial') ? 'is-invalid' : ''}`}
                id="kmInicial"
                value={formData.kmInicial}
                onChange={handleNumericInput}
                onBlur={() => handleBlur('kmInicial')}
                placeholder="Digite a quilometragem inicial"
                required
                maxLength={7}
              />
              {shouldShowError('kmInicial') && <div className="invalid-feedback">{errors.kmInicial}</div>}
            </div>

            <div className="col-6">
              <label className="form-label small">Quilometragem Final</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                className={`form-control ${shouldShowError('kmFinal') ? 'is-invalid' : ''}`}
                id="kmFinal"
                value={formData.kmFinal}
                onChange={handleNumericInput}
                onBlur={() => handleBlur('kmFinal')}
                placeholder="Digite a quilometragem final"
                maxLength={7}
              />
              {shouldShowError('kmFinal') && <div className="invalid-feedback">{errors.kmFinal}</div>}
            </div>

            <div className="col-12">
              <label className="form-label small">Destino</label>
              <input
                type="text"
                className={`form-control ${shouldShowError('destino') ? 'is-invalid' : ''}`}
                id="destino"
                value={formData.destino}
                onChange={(e) => handleFieldChange('destino', e.target.value)}
                onBlur={() => handleBlur('destino')}
                placeholder="Digite o destino"
                required
              />
              {shouldShowError('destino') && <div className="invalid-feedback">{errors.destino}</div>}
            </div>

            <div className="col-12">
              <label className="form-label small">Observações</label>
              <textarea
                className={`form-control ${shouldShowError('observacoes') ? 'is-invalid' : ''}`}
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleFieldChange('observacoes', e.target.value)}
                onBlur={() => handleBlur('observacoes')}
                placeholder="Digite as observações"
                rows={3}
              />
              {shouldShowError('observacoes') && <div className="invalid-feedback">{errors.observacoes}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="d-grid gap-2">
        <button 
          type="submit" 
          className={`btn ${isFormValid ? 'btn-primary' : 'btn-secondary'}`}
          disabled={!isFormValid}
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Salvar
        </button>
      </div>
    </form>
  );
};

export default EventForm; 