import React from 'react';
import { DriverTypes } from './types/driverTypes';
import Modal from '../../components/Modals/Modal';

interface DriverViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver: DriverTypes | null;
}

const DriverViewModal: React.FC<DriverViewModalProps> = ({ isOpen, onClose, driver }) => {
    if (!driver) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Motorista" size="lg">
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-primary">Dados Pessoais</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">Primeiro Nome</label>
                        <div className="form-control-plaintext">{driver.firstName}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Sobrenome</label>
                        <div className="form-control-plaintext">{driver.lastName}</div>
                    </div>
                </div>
                <div className="row g-3 mt-1">
                    <div className="col-md-6">
                        <label className="form-label small">Email</label>
                        <div className="form-control-plaintext">{driver.email}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Telefone</label>
                        <div className="form-control-plaintext">{driver.phone}</div>
                    </div>
                </div>
                <div className="row g-3 mt-1">
                    <div className="col-md-6">
                        <label className="form-label small">CNH</label>
                        <div className="form-control-plaintext">{driver.cnh}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Tipo CNH</label>
                        <div className="form-control-plaintext">{driver.cnhType}</div>
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
                <h6 className="fw-bold mb-3 text-primary">Endereço</h6>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">CEP</label>
                        <div className="form-control-plaintext">{driver.address?.zipCode}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Endereço</label>
                        <div className="form-control-plaintext">{driver.address?.street}</div>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">Número</label>
                        <div className="form-control-plaintext">{driver.address?.number}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Bairro</label>
                        <div className="form-control-plaintext">{driver.address?.district}</div>
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small">Cidade</label>
                        <div className="form-control-plaintext">{driver.address?.city}</div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small">Estado</label>
                        <div className="form-control-plaintext">{driver.address?.state}</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DriverViewModal;
