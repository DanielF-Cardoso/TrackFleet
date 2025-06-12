import React from 'react';
import Modal from '../../components/Modals/Modal';
import { EventTypes } from './types/eventTypes';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: EventTypes | null;
}

const statusLabel = (status: string) => {
  if (status === 'ENTRY') return 'Finalizado';
  if (status === 'EXIT') return 'Em andamento';
  return status;
};

const ViewEventModal: React.FC<Props> = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Evento" size="lg">
      <form>
        <div className="mb-4">
          <h6 className="fw-bold text-primary mb-3">Dados do Evento</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Status</label>
              <div className="form-control-plaintext">{statusLabel(event.status)}</div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Odômetro</label>
              <div className="form-control-plaintext">{event.odometer}</div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Início</label>
              <div className="form-control-plaintext">
                {event.startAt ? format(new Date(event.startAt), 'dd/MM/yyyy') : '-'}
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Fim</label>
              <div className="form-control-plaintext">
                {event.endAt ? format(new Date(event.endAt), 'dd/MM/yyyy') : '-'}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mb-4">
          <h6 className="fw-bold mb-3 text-primary">Carro</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Placa</label>
              <div className="form-control-plaintext">{event.car?.licensePlate || event.carId}</div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Marca</label>
              <div className="form-control-plaintext">{event.car?.brand || '-'}</div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Ano</label>
              <div className="form-control-plaintext">{event.car?.year || '-'}</div>
            </div>
            <div className="col-md-3">
              <label className="form-label small">Modelo</label>
              <div className="form-control-plaintext">{event.car?.model || '-'}</div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mb-4">
          <h6 className="fw-bold mb-3 text-primary">Motorista</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small">Nome</label>
              <div className="form-control-plaintext">
                {event.driver ? `${event.driver.firstName} ${event.driver.lastName}` : event.driverId}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small">Email</label>
              <div className="form-control-plaintext">{event.driver?.email || '-'}</div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ViewEventModal;