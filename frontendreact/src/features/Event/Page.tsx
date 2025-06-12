import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modals/Modal';
import EventForm from './Form';
import TopBar from '../../components/TopBar';
import DataTable from '../../components/DataTable';
import Preloader from '../../components/Preloader';
import { EventTypes, EventFormData, EventTableData } from './types/eventTypes';
import ViewEventModal from './View';
import { useEvents } from '../../hooks/useEvent';
import { createEvent, deleteEvent, finalizeEvent } from '../../services/eventService';
import { CarOption, DriverOption } from './types/eventOptions';
import { fetchFleets } from '../../services/fleetService';
import { fetchDrivers } from '../../services/driverService';
import { format } from 'date-fns'
import FinishEventModal from './Finalize';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EventPage: React.FC = () => {
  const { events = [], loading, error, refetch } = useEvents();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [eventToToggle, setEventToToggle] = useState<EventTypes | null>(null);
  const [currentEvent, setCurrentEvent] = useState<EventTypes | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [finishOdometer, setFinishOdometer] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEvent, setViewEvent] = useState<EventTypes | null>(null);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventTypes | null>(null);

  const statusLabel = (status: string) => {
    if (status === 'ENTRY') return 'ENTRADA';
    if (status === 'EXIT') return 'SAÍDA';
    return status;
  };

  const filteredEvents = events
    .filter(event => showInactive ? event.status !== 'EXIT' : event.status === 'EXIT')
    .filter(event =>
      event.carId.toLowerCase().includes(search.toLowerCase()) ||
      event.driverId.toLowerCase().includes(search.toLowerCase())
    );

  const eventsData: EventTableData[] = filteredEvents.map(event => ({
    id: event.id,
    carId: event.car ? `${event.car.licensePlate} - ${event.car.model}` : event.carId,
    driverId: event.driver ? `${event.driver.firstName} ${event.driver.lastName}` : event.driverId,
    managerId: event.managerId,
    odometer: event.odometer.toString(),
    status: statusLabel(event.status), // <-- aqui!
    startAt: event.startAt ? format(new Date(event.startAt), 'dd/MM/yyyy') : '',
    endAt: event.endAt ? format(new Date(event.endAt), 'dd/MM/yyyy') : '',
    createdAt: event.createdAt,
  }));

  const [formData, setFormData] = useState<EventFormData>({
    carId: '',
    driverId: '',
    managerId: '',
    odometer: '',
    status: 'EXIT',
    startAt: '',
  });

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        odometer: Number(formData.odometer),
        managerId: formData.managerId,
      });
      showAlertMessage('Evento adicionado com sucesso!');
      setShowModal(false);
      resetForm();
      refetch();
    } catch (err: any) {
      const apiError = err?.response?.data?.message || 'Erro ao adicionar evento!';
      showAlertMessage(apiError);
    }
  };

  const handleOpenDeleteModal = (eventTable: EventTableData) => {
    const event = events.find(e => e.id === eventTable.id);
    if (!event) return;
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      showAlertMessage('Evento deletado com sucesso!');
      setShowDeleteModal(false);
      setEventToDelete(null);
      refetch();
    } catch (err: any) {
      const apiError = err?.response?.data?.message || 'Erro ao deletar evento!';
      showAlertMessage(apiError);
    }
  };

  const handleView = (eventTable: EventTableData) => {
    const event = events.find(e => e.id === eventTable.id);
    if (!event) return;
    setViewEvent(event);
    setShowViewModal(true);
  };

  const handleFinishEvent = async (event: EventTypes) => {
    try {
      await finalizeEvent(event.id, {
        odometer: Number(finishOdometer),
        endAt: new Date().toISOString(),
      });
      showAlertMessage('Evento finalizado com sucesso!');
      setShowConfirmModal(false);
      setEventToToggle(null);
      setFinishOdometer('');
      refetch();
    } catch (err: any) {
      const apiError = err?.response?.data?.message || 'Erro ao finalizar evento!';
      showAlertMessage(apiError);
    }
  };

  const handleOpenFinishModal = (eventTable: EventTableData) => {
    const event = events.find(e => e.id === eventTable.id);
    if (!event) return;
    setEventToToggle(event);
    setShowConfirmModal(true);
    setFinishOdometer('');
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      carId: '',
      driverId: '',
      managerId: '',
      odometer: '',
      status: 'EXIT',
      startAt: '',
    });
    setCurrentEvent(null);
  };

  const canFinishEvent = (event: EventTableData) => {
    return event.status !== 'ENTRY';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchFleets().then(fleets => {
      setCars(
        fleets
          .filter(fleet => Boolean(fleet.isActive) && fleet.status === 'AVAILABLE')
          .map(fleet => ({
            id: fleet.id,
            label: `${fleet.licensePlate} - ${fleet.model}`
          }))
      );
    });

    fetchDrivers().then(drivers => {
      setDrivers(
        drivers
          .filter(driver => String(driver.isActive) === 'true')
          .map(driver => ({
            id: driver.id,
            label: `${driver.firstName} ${driver.lastName}`
          }))
      );
    });
  }, []);

  const columns = [
    { label: 'PLACA / MODELO', field: 'carId' },
    { label: 'MOTORISTA', field: 'driverId' },
    { label: 'ODÔMETRO', field: 'odometer' },
    { label: 'STATUS', field: 'status' },
    { label: 'INÍCIO', field: 'startAt' },
    { label: 'FIM', field: 'endAt' },
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
      {loading && <Preloader />}
      {error && <div>{error}</div>}
      <div className="card shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="input-group w-100 w-md-50 mb-2 mb-md-0">
            <span
              className="input-group-text text-white border-0 rounded-start"
              style={{
                background: 'linear-gradient(90deg, #ff763b 0%, #ffc480 100%)',
                border: 'none'
              }}
            >
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por carro ou motorista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
          </div>
          <button
            className={`btn ${showInactive ? 'btn-outline-primary' : 'btn-primary'} ms-md-3 mt-2 mt-md-0`}
            style={{
              minWidth: 170,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #ff763b 0%, #ffc480 100%)',
              border: 'none'
            }} onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Mostrar Ativos' : 'Mostrar Finalizados'}
          </button>
        </div>
      </div>
      
      {eventsData.length === 0 && !loading ? (
        <div className="text-center my-4">Nenhum evento encontrado.</div>
      ) : (
        <DataTable
          columns={columns}
          data={eventsData}
          onView={handleView}
          onDelete={handleOpenDeleteModal}
          onToggleStatus={
            eventsData.every(event => event.status === 'ENTRY')
              ? undefined
              : handleOpenFinishModal
          }
          statusConfig={{
            active: {
              value: 'Ativo',
              badgeClass: 'badge-success'
            },
            inactive: {
              value: 'Inativo',
              badgeClass: 'badge-danger'
            }
          }}
          headerGradient={{ start: '#ff763b', end: '#ffc480' }}
        />
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentEvent ? 'Editar Evento' : 'Adicionar Evento'}
        size="xl"
      >
        <EventForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          cars={cars || []}
          drivers={drivers || []}
        />
      </Modal>

      <ViewEventModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        event={viewEvent}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteEvent}
        title="Excluir Evento"
        message="Tem certeza que deseja excluir este evento?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmIcon={faTrash}
      />

      <FinishEventModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setEventToToggle(null);
          setFinishOdometer('');
        }}
        finishOdometer={finishOdometer}
        setFinishOdometer={setFinishOdometer}
        eventToToggle={eventToToggle}
        handleFinishEvent={handleFinishEvent}
      />

      {showAlert && (
        <div className={`alerta ${alertMessage.includes('sucesso') ? 'sucesso' : 'erro'} show`}>
          {alertMessage}
        </div>
      )}
    </Layout>
  );
};

export default EventPage;