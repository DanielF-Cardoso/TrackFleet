import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modals/Modal';
import ManagerForm from './Form';
import ManagerFormEdit from './FormEdit';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TopBar from '../../components/TopBar';
import DataTable from '../../components/DataTable';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { useManagers } from '../../hooks/useManagers';
import { createManager, inactivateManager } from '../../services/managerService';
import { updateManager } from '../../services/managerService';
import { ManagerTypes, ManagerFormData, ManagerTableData } from './types/managerTypes';
import Preloader from '../../components/Preloader';
import ViewManagerModal from './View';

const Manager: React.FC = () => {
  const { managers, loading, error, refetch } = useManagers();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [managerToToggle, setManagerToToggle] = useState<ManagerTypes | null>(null);
  const [Managers, setManagers] = useState<ManagerTypes[]>([]);
  const [currentManager, setCurrentManager] = useState<ManagerTypes | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewManager, setViewManager] = useState<ManagerTypes | null>(null);

  const filteredManagers = managers
    .filter(manager => showInactive ? !manager.isActive : manager.isActive)
    .filter(manager =>
      manager.firstName.toLowerCase().includes(search.toLowerCase()) ||
      manager.lastName.toLowerCase().includes(search.toLowerCase())
    );

  const managersData: ManagerTableData[] = filteredManagers.map(manager => ({
    id: manager.id,
    firstName: manager.firstName,
    lastName: manager.lastName,
    email: manager.email,
    phone: manager.phone,
    status: manager.isActive ? 'Ativo' : 'Inativo'
  }));

  const [formData, setFormData] = useState<ManagerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    password: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    isActive: true
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

    if (currentManager) {
      try {
        // Monta o objeto sem a senha
        const { password, ...dataToSend } = formData;
        await updateManager(currentManager.id, {
          ...dataToSend,
          phone: formData.phone.replace(/\D/g, ''),
          zipCode: formData.zipCode.replace(/\D/g, ''),
          number: Number(formData.number),
        });
        showAlertMessage('Gestor atualizado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao atualizar gestor!';
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
        await createManager({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone.replace(/\D/g, ''),
          street: formData.street,
          number: Number(formData.number),
          district: formData.district,
          zipCode: formData.zipCode.replace(/\D/g, ''),
          city: formData.city,
          state: formData.state,
        });
        showAlertMessage('Gestor adicionado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao adicionar gestor!';
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

  const handleEdit = (managerTable: ManagerTableData) => {
    // Busca o manager completo (com address) pelo id
    const manager = managers.find(m => m.id === managerTable.id);
    if (!manager) return;

    const address = manager.address || {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: ''
    };

    setCurrentManager({
      ...manager,
      address: manager.address
        ? { ...manager.address, number: manager.address.number !== undefined && manager.address.number !== null ? String(manager.address.number) : '' }
        : manager.address
    });
    setFormData({
      firstName: manager.firstName ?? '',
      lastName: manager.lastName ?? '',
      email: manager.email ?? '',
      phone: manager.phone ?? '',
      street: address.street ?? '',
      password: '',
      number: address.number !== undefined && address.number !== null ? String(address.number) : '',
      district: address.district ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      zipCode: address.zipCode ?? '',
      isActive: manager.isActive
    });
    setShowModal(true);
  };

  const handleViewProfile = (manager: ManagerTypes) => {
    setViewManager(manager);
    console.log('View Manager:', manager);
    setShowViewModal(true);
    setActiveDropdown(null);
  };

  const handleToggleStatus = (managerTable: ManagerTableData) => {
    const manager = managers.find(m => m.id === managerTable.id);
    if (!manager) return;
    if (manager.isActive) {
      setManagerToToggle({
        ...manager,
        address: manager.address
          ? { ...manager.address, number: String(manager.address.number) }
          : manager.address
      });
      setShowConfirmModal(true);
    } else {
      updateManagerStatus({
        ...manager,
        address: manager.address
          ? { ...manager.address, number: String(manager.address.number) }
          : manager.address
      });
    }
  };

  const updateManagerStatus = async (manager: ManagerTypes) => {
    try {
      await inactivateManager(manager.id);
      showAlertMessage(`Gestor inativado com sucesso!`);
      setShowConfirmModal(false);
      setManagerToToggle(null);
      refetch();
    } catch (error: any) {
      let msg = 'Erro ao inativar gestor!';
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

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      password: '',
      number: '',
      district: '',
      city: '',
      state: '',
      zipCode: '',
      isActive: true
    });
    setCurrentManager(null);
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
    { label: 'NOME', field: 'firstName' },
    { label: 'SOBRENOME', field: 'lastName' },
    { label: 'EMAIL', field: 'email' },
    { label: 'TELEFONE', field: 'phone' },
    { label: 'STATUS', field: 'status' }];

  return (
    <Layout>
      <TopBar
        title="Controle de Gestores"
        buttonText="Adicionar Gestores"
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
              placeholder="Pesquisar por nome..."
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
      <DataTable
        columns={columns}
        data={managersData}
        onView={(managerTable) => {
          const manager = managers.find(m => m.id === managerTable.id);
          if (manager) {
            handleViewProfile({
              ...manager,
              address: manager.address
                ? { ...manager.address, number: String(manager.address.number) }
                : manager.address
            });
          }
        }}
        onEdit={handleEdit}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentManager ? 'Editar Gestor' : 'Adicionar Gestor'}
        size="xl"
      >
        {currentManager ? (
          <ManagerFormEdit
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <ManagerForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setManagerToToggle(null);
        }}
        onConfirm={() => managerToToggle && updateManagerStatus(managerToToggle)}
        title="Inativar Gestor"
        message="Tem certeza que deseja inativar este Gestor?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Inativar"
        cancelText="Cancelar"
        confirmIcon={faBan}
      />

      <ViewManagerModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        manager={viewManager}
      />

      {showAlert && (
        <div className={`alerta ${alertMessage.includes('sucesso') ? 'sucesso' : 'erro'} show`}>
          {alertMessage}
        </div>
      )}
    </Layout>
  );
};

export default Manager;