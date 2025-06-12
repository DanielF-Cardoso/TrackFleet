import React from 'react';
import Modal from '../../components/Modals/Modal';
import { ManagerTypes } from './types/managerTypes';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    manager: ManagerTypes | null;
}

const ViewManagerModal: React.FC<Props> = ({ isOpen, onClose, manager }) => {
    if (!manager) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Gestor" size="lg">
            <form>
                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold text-primary mb-0">Dados Pessoais</h6>
                        <span className={`badge ${manager.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {manager.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">Primeiro Nome</label>
                            <div className="form-control-plaintext">{manager.firstName}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Sobrenome</label>
                            <div className="form-control-plaintext">{manager.lastName}</div>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">Email</label>
                            <div className="form-control-plaintext">{manager.email}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Telefone</label>
                            <div className="form-control-plaintext">{manager.phone}</div>
                        </div>
                    </div>
                </div>
                <hr className="my-4" />
                <div className="mb-4">
                    <h6 className="fw-bold mb-3 text-primary">Endereço</h6>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">CEP</label>
                            <div className="form-control-plaintext">{manager.address?.zipCode}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Endereço</label>
                            <div className="form-control-plaintext">{manager.address?.street}</div>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">Número</label>
                            <div className="form-control-plaintext">{manager.address?.number}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Bairro</label>
                            <div className="form-control-plaintext">{manager.address?.district}</div>
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small">Cidade</label>
                            <div className="form-control-plaintext">{manager.address?.city}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small">Estado</label>
                            <div className="form-control-plaintext">{manager.address?.state}</div>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ViewManagerModal;