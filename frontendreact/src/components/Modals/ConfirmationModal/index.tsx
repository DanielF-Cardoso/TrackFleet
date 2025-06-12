import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faTimes, 
  faBan, 
  faTrashAlt 
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './styles.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  confirmIcon?: IconDefinition;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar Ação',
  message = 'Tem certeza que deseja realizar esta ação?',
  subMessage = 'Esta ação não poderá ser desfeita.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonClass = 'btn-danger',
  confirmIcon = faBan
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop show" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1040,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={onClose}
      />
      <div 
        className="modal confirmation-modal show" 
        style={{ 
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1045,
          overflow: 'hidden',
          outline: 0
        }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body text-center">
              <FontAwesomeIcon 
                icon={faExclamationTriangle}
                className="warning-icon"
              />
              <p className="mb-2">{message}</p>
              <p className="text-muted small mb-0">{subMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                {cancelText}
              </button>
              <button
                className={`btn ${confirmButtonClass}`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <FontAwesomeIcon icon={confirmIcon} className="me-2" />
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal; 