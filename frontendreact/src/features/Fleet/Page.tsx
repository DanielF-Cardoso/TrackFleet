import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modals/Modal';
import FleetsForm from './Form';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TopBar from '../../components/TopBar';
import DataTable from '../../components/DataTable';
import { faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import Preloader from '../../components/Preloader';
import { useFleets } from '../../hooks/useFleets';
import { createFleet, deleteFleet, inactivateFleet, updateFleet } from '../../services/fleetService';
import { FleetFormData, FleetTableData, FleetTypes } from './types/fleetTypes';

const Fleets: React.FC = () => {
  const { fleets = [], loading, error, refetch } = useFleets();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [fleetsToToggle, setFleetsToToggle] = useState<FleetTypes | null>(null);
  const [currentFleets, setCurrentFleets] = useState<FleetTypes | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fleetToDelete, setFleetToDelete] = useState<FleetTypes | null>(null);

  const filteredFleets = fleets
    .filter(fleet => showInactive ? !fleet.isActive : fleet.isActive)
    .filter(fleet =>
      fleet.model.toLowerCase().includes(search.toLowerCase()) ||
      fleet.brand.toLowerCase().includes(search.toLowerCase()) ||
      fleet.licensePlate.toLowerCase().includes(search.toLowerCase())
    );

  const fleetsData: FleetTableData[] = filteredFleets.map(fleet => ({
    id: fleet.id,
    licensePlate: fleet.licensePlate,
    brand: fleet.brand,
    model: fleet.model,
    year: fleet.year.toString(),
    color: fleet.color,
    odometer: fleet.odometer.toString(),
    renavam: fleet.renavam,
    status: fleet.isActive ? 'Ativo' : 'Inativo'
  }));

  const [formData, setFormData] = useState<FleetFormData>({
    licensePlate: '',
    brand: '',
    model: '',
    year: '0',
    color: '',
    odometer: '0',
    renavam: '',
    isActive: true,
    status: 'AVAILABLE'
  });

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleEdit = (fleetTable: FleetTableData) => {
    const fleet = fleets.find(f => f.id === fleetTable.id);
    if (!fleet) return;
    setCurrentFleets(fleet);
    setFormData({
      licensePlate: fleet.licensePlate ?? '',
      brand: fleet.brand ?? '',
      model: fleet.model ?? '',
      year: fleet.year !== undefined && fleet.year !== null ? String(fleet.year) : '',
      color: fleet.color ?? '',
      odometer: fleet.odometer !== undefined && fleet.odometer !== null ? String(fleet.odometer) : '',
      renavam: fleet.renavam ?? '',
      status: fleet.status as 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE',
      isActive: Boolean(fleet.isActive)
    });
    setShowModal(true);
  };

  const handleDelete = (fleetTable: FleetTableData) => {
    const fleet = fleets.find(f => f.id === fleetTable.id);
    if (!fleet) return;
    setFleetToDelete(fleet);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = (fleetsTable: FleetTableData) => {
    const fleet = fleets.find(f => f.id === fleetsTable.id);
    if (!fleet) return;
    if (fleet.isActive) {
      setFleetsToToggle(fleet);
      setShowConfirmModal(true);
    } else {
      updateFleetStatus(fleet);
    }
  };
  const updateFleetStatus = async (fleet: FleetTypes) => {
    try {
      await inactivateFleet(fleet.id);
      showAlertMessage(`Carro inativado com sucesso!`);
      setShowConfirmModal(false);
      setFleetsToToggle(null);
      refetch();
    } catch (error: any) {
      let msg = 'Erro ao inativar carro!';
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          msg = error.response.data.message
            .map((m: any) =>
              typeof m === 'string'
                ? m
                : m.constraints
                  ? Object.values(m.constraints).join(', ')
                  : JSON.stringify(m)
            )
            .join(' | ');
        } else if (typeof error.response.data.message === 'string') {
          msg = error.response.data.message;
        }
      }
      showAlertMessage(msg);
    }
  };

  const deleteFleetConfirmed = async () => {
    if (!fleetToDelete) return;
    try {
      await deleteFleet(fleetToDelete.id);
      showAlertMessage('Carro deletado com sucesso!');
      setShowDeleteModal(false);
      setFleetToDelete(null);
      refetch();
    } catch (error: any) {
      let msg = 'Erro ao deletar carro!';
      if (error.response?.data?.message) {
        msg = Array.isArray(error.response.data.message)
          ? error.response.data.message.map((m: any) =>
            typeof m === 'string'
              ? m
              : m.constraints
                ? Object.values(m.constraints).join(', ')
                : JSON.stringify(m)
          ).join(' | ')
          : error.response.data.message;
      }
      showAlertMessage(msg);
    }
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      licensePlate: '',
      brand: '',
      model: '',
      year: '0',
      color: '',
      odometer: '0',
      renavam: '',
      isActive: true,
      status: 'AVAILABLE'
    });
    setCurrentFleets(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFleets) {
      try {
        await updateFleet(currentFleets.id, {
          licensePlate: formData.licensePlate,
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          color: formData.color,
          odometer: Number(formData.odometer),
          renavam: formData.renavam,
        });
        showAlertMessage('Carro atualizado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao atualizar carro!';
        if (err.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            msg = err.response.data.message
              .map((m: any) =>
                typeof m === 'string'
                  ? m
                  : m.constraints
                    ? Object.values(m.constraints).join(', ')
                    : JSON.stringify(m)
              )
              .join(' | ');
          } else if (typeof err.response.data.message === 'string') {
            msg = err.response.data.message;
          }
        }
        showAlertMessage(msg);
      }
    } else {
      try {
        await createFleet({
          licensePlate: formData.licensePlate,
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          color: formData.color,
          odometer: Number(formData.odometer),
          renavam: formData.renavam,
        });
        showAlertMessage('Carro adicionado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao adicionar carro!';
        if (err.response?.data?.message) {
          if (Array.isArray(err.response.data.message)) {
            msg = err.response.data.message
              .map((m: any) =>
                typeof m === 'string'
                  ? m
                  : m.constraints
                    ? Object.values(m.constraints).join(', ')
                    : JSON.stringify(m)
              )
              .join(' | ');
          } else if (typeof err.response.data.message === 'string') {
            msg = err.response.data.message;
          }
        }
        showAlertMessage(msg);
      }
    }
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

  const columns = [
    { label: 'MODELO', field: 'model' },
    { label: 'MARCA', field: 'brand' },
    { label: 'PLACA', field: 'licensePlate' },
    { label: 'ANO', field: 'year' },
    { label: 'COR', field: 'color' },
    { label: 'ODÔMETRO', field: 'odometer' },
    { label: 'RENAVAM', field: 'renavam' },
    { label: 'STATUS', field: 'status' }];

  return (
    <Layout>
      <TopBar
        title="Controle de Frota"
        buttonText="Adicionar Carro"
        onButtonClick={() => {
          resetForm();
          setShowModal(true);
        }}
        gradientStart="#0e4cfd"
        gradientEnd="#6a8eff"
      />
      {loading && <Preloader />}
      {error && <div>{error}</div>}
      <div className="card shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="input-group w-100 w-md-50 mb-2 mb-md-0">
            <span className="input-group-text bg-primary text-white border-0 rounded-start">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Pesquisar por modelo, marca ou placa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
          </div>
          <button
            className={`btn ${showInactive ? 'btn-outline-primary' : 'btn-primary'} ms-md-3 mt-2 mt-md-0`}
            style={{ minWidth: 170, borderRadius: 8 }}
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Mostrar Ativos' : 'Mostrar Inativos'}
          </button>
        </div>
      </div>
      {fleetsData.length === 0 && !loading ? (
        <div className="text-center my-4">Nenhum carro cadastrado.</div>
      ) : (
        <DataTable
          columns={columns}
          data={fleetsData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
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
          headerGradient={{ start: '#0e4cfd', end: '#6a8eff' }}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentFleets ? 'Editar Carro' : 'Adicionar Carro'}
        size="xl"
      >
        <FleetsForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setFleetsToToggle(null);
        }}
        onConfirm={() => fleetsToToggle && updateFleetStatus(fleetsToToggle)}
        title="Inativar Carro"
        message="Tem certeza que deseja inativar este Carro?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Inativar"
        cancelText="Cancelar"
        confirmIcon={faBan}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFleetToDelete(null);
        }}
        onConfirm={deleteFleetConfirmed}
        title="Deletar Carro"
        message="Tem certeza que deseja deletar este Carro?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        confirmIcon={faTrash}
      />

      {showAlert && (
        <div className={`alerta ${alertMessage.includes('sucesso') ? 'sucesso' : 'erro'} show`}>
          {alertMessage}
        </div>
      )}
    </Layout>
  );
};

export default Fleets;