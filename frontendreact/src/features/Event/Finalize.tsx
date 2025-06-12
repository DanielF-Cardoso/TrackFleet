import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import Modal from '../../components/Modals/Modal';
import { EventTypes } from './types/eventTypes';

const finalizeSchema = z.object({
    odometer: z.string().min(1, 'O odômetro é obrigatório'),
});

interface FinishEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    finishOdometer: string;
    setFinishOdometer: (value: string) => void;
    eventToToggle: EventTypes | null;
    handleFinishEvent: (event: EventTypes) => void;
}

const FinishEventModal: React.FC<FinishEventModalProps> = ({
    isOpen,
    onClose,
    finishOdometer,
    setFinishOdometer,
    eventToToggle,
    handleFinishEvent,
}) => {
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<boolean>(false);
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

    useEffect(() => {
        try {
            finalizeSchema.parse({ odometer: finishOdometer });
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
    }, [finishOdometer]);

    const handleNumericInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 7);
        setFinishOdometer(value);
        setTouched(true);
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWasSubmitted(true);
        if (isFormValid && eventToToggle) {
            handleFinishEvent(eventToToggle);
        }
    };

    const shouldShowError = () =>
        (touched || wasSubmitted) && errors.odometer;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Finalizar Evento"
            size="md"
        >
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <h6 className="fw-bold mb-3 text-primary">Informe o Odômetro Final</h6>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="form-label small">Odômetro</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                className={`form-control ${shouldShowError() ? 'is-invalid' : ''}`}
                                id="odometer"
                                value={finishOdometer}
                                onChange={handleNumericInput}
                                onBlur={() => setTouched(true)}
                                placeholder="Digite o odômetro final"
                                required
                                maxLength={7}
                            />
                            {shouldShowError() && (
                                <div className="invalid-feedback">{errors.odometer}</div>
                            )}
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
                        Finalizar Evento
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FinishEventModal;