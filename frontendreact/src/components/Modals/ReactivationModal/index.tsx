import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faTimes, 
  faUserCheck
} from '@fortawesome/free-solid-svg-icons';
import './styles.css';

interface ReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'motorista' | 'gestor' | string;
}

const ReactivationModal: React.FC<ReactivationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Reativar',
  message = 'Tem certeza que deseja reativar?',
  subMessage = 'Esta ação reativará o acesso ao sistema.',
  confirmText = 'Reativar',
  cancelText = 'Cancelar',
  type = 'motorista' // ou 'gestor'
}) => {
  if (!isOpen) return null;

  const fullTitle = `Reativar ${type.charAt(0).toUpperCase() + type.slice(1)}`;

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
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
        onClick={onClose}
      />
      <div 
        className="modal reactivation-modal show d-flex align-items-center" 
        style={{ 
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
          className="modal-dialog"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title || fullTitle}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <FontAwesomeIcon 
                icon={faExclamationTriangle}
                className="warning-icon"
              />
              <p className="mb-2">
                {message || `Tem certeza que deseja reativar este ${type}?`}
              </p>
              <p className="text-muted small mb-0">{subMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                {cancelText}
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <FontAwesomeIcon icon={faUserCheck} className="me-1" />
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReactivationModal; 