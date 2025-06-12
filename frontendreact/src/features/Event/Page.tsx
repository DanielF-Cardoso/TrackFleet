import React, { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modals/Modal';
import EventForm from './Form';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TopBar from '../../components/TopBar';
import DataTable from '../../components/DataTable';
import { faBan } from '@fortawesome/free-solid-svg-icons';

interface Evento {
  id: number;
  motorista: string;
  veiculo: string;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim: string | null;
  kmInicial: string;
  kmFinal: string | null;
  destino: string;
  observacoes: string;
}

const Event: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [eventoToToggle, setEventoToToggle] = useState<Evento | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([
    // Dados de exemplo
    {
      id: 1,
      motorista: 'João Silva',
      veiculo: 'ABC1D23',
      tipo: 'Entrega',
      status: 'Em andamento',
      dataInicio: '2024-03-20',
      dataFim: null,
      kmInicial: '10000',
      kmFinal: null,
      destino: 'São Paulo, SP',
      observacoes: 'Entrega urgente'
    }
  ]);
  const [currentEvento, setCurrentEvento] = useState<Evento | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Evento>>({
    motorista: '',
    veiculo: '',
    tipo: '',
    dataInicio: '',
    dataFim: '',
    kmInicial: '',
    kmFinal: '',
    destino: '',
    observacoes: '',
    status: 'Em andamento'
  });

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentEvento) {
      // Editando evento existente
      const updatedEventos = eventos.map(evento =>
        evento.id === currentEvento.id ? { ...evento, ...formData } as Evento : evento
      );
      setEventos(updatedEventos);
      showAlertMessage('Evento atualizado com sucesso!');
    } else {
      // Adicionando novo evento
      const newEvento: Evento = {
        id: eventos.length + 1,
        ...formData
      } as Evento;
      setEventos(prev => [...prev, newEvento]);
      showAlertMessage('Evento adicionado com sucesso!');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este evento?')) {
      setEventos(prev => prev.filter(evento => evento.id !== id));
      showAlertMessage('Evento removido com sucesso!');
    }
  };

  const handleEdit = (evento: Evento) => {
    setCurrentEvento(evento);
    setFormData(evento);
    setShowModal(true);
  };

  const handleDropdownClick = (id: number) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleViewProfile = (evento: Evento) => {
    // Implementar visualização do perfil
    console.log('Visualizar perfil:', evento);
    setActiveDropdown(null);
  };

  const handleToggleStatus = (evento: Evento) => {
    if (evento.status === 'Em andamento') {
      setEventoToToggle(evento);
      setShowConfirmModal(true);
    } else {
      // Se estiver finalizado, não permite reabrir
      showAlertMessage('Não é possível reabrir um evento finalizado.');
    }
  };

  const updateEventoStatus = (evento: Evento) => {
    const updatedEventos = eventos.map(e => {
      if (e.id === evento.id) {
        return {
          ...e,
          status: 'Finalizado',
          dataFim: new Date().toISOString().split('T')[0]
        };
      }
      return e;
    });
    setEventos(updatedEventos);
    showAlertMessage('Evento finalizado com sucesso!');
    setShowConfirmModal(false);
    setEventoToToggle(null);
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      motorista: '',
      veiculo: '',
      tipo: '',
      dataInicio: '',
      dataFim: '',
      kmInicial: '',
      kmFinal: '',
      destino: '',
      observacoes: '',
      status: 'Em andamento'
    });
    setCurrentEvento(null);
  };

  // Fecha o dropdown quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const columns = [
    { label: 'MOTORISTA', field: 'motorista' },
    { label: 'VEÍCULO', field: 'veiculo' },
    { label: 'TIPO', field: 'tipo' },
    { label: 'DESTINO', field: 'destino' },
    { label: 'DATA INÍCIO', field: 'dataInicio' },
    { label: 'DATA FIM', field: 'dataFim' },
    { label: 'KM INICIAL', field: 'kmInicial' },
    { label: 'KM FINAL', field: 'kmFinal' },
    { label: 'STATUS', field: 'status' }
  ];

  return (
    <Layout>
      <TopBar 
        title="Controle de Eventos"
        buttonText="Adicionar Evento"
        onButtonClick={() => {
          resetForm();
          setShowModal(true);
        }}
        gradientStart="#ff763b"
        gradientEnd="#ffc480"
      />
      <DataTable
        columns={columns}
        data={eventos}
        onView={handleViewProfile}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        statusConfig={{
          active: {
            value: 'Em andamento',
            badgeClass: 'badge-warning'
          },
          inactive: {
            value: 'Finalizado',
            badgeClass: 'badge-success'
          }
        }}
        headerGradient={{ start: '#ff9800', end: '#f57c00' }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentEvento ? 'Editar Evento' : 'Adicionar Evento'}
        size="xl"
      >
        <EventForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setEventoToToggle(null);
        }}
        onConfirm={() => eventoToToggle && updateEventoStatus(eventoToToggle)}
        title="Finalizar Evento"
        message="Tem certeza que deseja finalizar este evento?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Finalizar"
        cancelText="Cancelar"
        confirmIcon={faBan}
      />

      {showAlert && (
        <div className={`alerta ${alertMessage.includes('sucesso') ? 'sucesso' : 'erro'} show`}>
          {alertMessage}
        </div>
      )}
    </Layout>
  );
};

export default Event; 