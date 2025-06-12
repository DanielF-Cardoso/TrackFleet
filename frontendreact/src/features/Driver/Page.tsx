import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modals/Modal';
import DriverForm from './Form';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TopBar from '../../components/TopBar';
import DataTable from '../../components/DataTable';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { DriverTypes, DriverFormData, DriverTableData } from './types/driverTypes';
import Preloader from '../../components/Preloader';
import { useDrivers } from '../../hooks/useDrivers';
import { createDriver, inactivateDriver, updateDriver } from '../../services/driverService';
import DriverViewModal from './View';

const Driver: React.FC = () => {
  const { drivers = [], loading, error, refetch } = useDrivers();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [driverToToggle, setDriverToToggle] = useState<DriverTypes | null>(null);
  const [Drivers, setDrivers] = useState<DriverTypes[]>([]);
  const [currentDriver, setCurrentDriver] = useState<DriverTypes | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDriver, setViewDriver] = useState<DriverTypes | null>(null);

  const filteredDrivers = drivers
    .filter(driver => showInactive ? !driver.isActive : driver.isActive)
    .filter(driver =>
      driver.firstName.toLowerCase().includes(search.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(search.toLowerCase())
    );

  const driversData: DriverTableData[] = filteredDrivers.map(driver => ({
    id: driver.id,
    firstName: driver.firstName,
    lastName: driver.lastName,
    email: driver.email,
    phone: driver.phone,
    cnh: driver.cnh,
    cnhType: driver.cnhType,
    status: driver.isActive ? 'Ativo' : 'Inativo'
  }));

  const [formData, setFormData] = useState<DriverFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    cnh: '',
    cnhType: 'A',
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

    if (currentDriver) {
      try {
        // Monta o objeto sem campos desnecessários
        const { ...dataToSend } = formData;
        await updateDriver(currentDriver.id, {
          ...dataToSend,
          phone: formData.phone.replace(/\D/g, ''),
          zipCode: formData.zipCode.replace(/\D/g, ''),
          number: Number(formData.number),
        });
        showAlertMessage('Motorista atualizado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao atualizar motorista!';
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
        await createDriver({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          cnh: formData.cnh,
          cnhType: formData.cnhType,
          phone: formData.phone.replace(/\D/g, ''),
          street: formData.street,
          number: Number(formData.number),
          district: formData.district,
          zipCode: formData.zipCode.replace(/\D/g, ''),
          city: formData.city,
          state: formData.state,
        });
        showAlertMessage('Motorista adicionado com sucesso!');
        setShowModal(false);
        resetForm();
        refetch();
      } catch (err: any) {
        let msg = 'Erro ao adicionar motorista!';
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

  const handleEdit = (driverTable: DriverTableData) => {
    const driver = drivers.find(d => d.id === driverTable.id);
    if (!driver) return;
    const address = driver.address || {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: ''
    };
    setCurrentDriver({
      ...driver,
      address: {
        ...address,
        number: address.number !== undefined && address.number !== null ? String(address.number) : ''
      }
    });
    setFormData({
      firstName: driver.firstName ?? '',
      lastName: driver.lastName ?? '',
      email: driver.email ?? '',
      phone: driver.phone ?? '',
      street: address.street ?? '',
      cnh: driver.cnh ?? '',
      cnhType: driver.cnhType ?? 'A',
      number: address.number !== undefined && address.number !== null ? String(address.number) : '',
      district: address.district ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      zipCode: address.zipCode ?? '',
      isActive: driver.isActive
    });
    setShowModal(true);
  };

  const handleViewProfile = (driver: DriverTypes) => {
    const address = driver.address || {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: ''
    };
    setViewDriver({
      ...driver,
      address: {
        ...address,
        number: address.number !== undefined && address.number !== null ? String(address.number) : ''
      }
    });
    setShowViewModal(true);
    setActiveDropdown(null);
  };

  const handleToggleStatus = (driverTable: DriverTableData) => {
    const driver = drivers.find(m => m.id === driverTable.id);
    if (!driver) return;
    const address = driver.address || {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: ''
    };
    const driverWithStringNumber = {
      ...driver,
      address: {
        ...address,
        number: address.number !== undefined && address.number !== null ? String(address.number) : ''
      }
    };
    if (driver.isActive) {
      setDriverToToggle(driverWithStringNumber);
      setShowConfirmModal(true);
    } else {
      updateDriverStatus(driverWithStringNumber);
    }
  };

  const updateDriverStatus = async (driver: DriverTypes) => {
    const address = driver.address || {
      street: '',
      number: '',
      district: '',
      zipCode: '',
      city: '',
      state: ''
    };
    const driverWithStringNumber = {
      ...driver,
      address: {
        ...address,
        number: address.number !== undefined && address.number !== null ? String(address.number) : ''
      }
    };
    try {
      await inactivateDriver(driverWithStringNumber.id);
      showAlertMessage(`Motorista inativado com sucesso!`);
      setShowConfirmModal(false);
      setDriverToToggle(null);
      refetch();
    } catch (error: any) {
      let msg = 'Erro ao inativar motorista!';
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
      cnh: '',
      cnhType: 'A',
      number: '',
      district: '',
      city: '',
      state: '',
      zipCode: '',
      isActive: true
    });
    setCurrentDriver(null);
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
    { label: 'CNH', field: 'cnh' },
    { label: 'TIPO CNH', field: 'cnhType' },
    { label: 'STATUS', field: 'status' }];

  return (
    <Layout>
      <TopBar
        title="Controle de Motoristas"
        buttonText="Adicionar Motorista"
        onButtonClick={() => {
          resetForm();
          setShowModal(true);
        }}
        gradientStart="#843cf6"
        gradientEnd="#759bff"
      />
      {loading && <Preloader />}
      {error && <div>{error}</div>}
      <div className="card shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="input-group w-100 w-md-50 mb-2 mb-md-0">
            <span
              className="input-group-text text-white border-0 rounded-start"
              style={{
                background: 'linear-gradient(90deg, #843cf6 0%, #759bff 100%)',
                border: 'none'
              }}
            >
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
            style={{
              minWidth: 170,
              borderRadius: 8,
              background: 'linear-gradient(90deg, #843cf6 0%, #759bff 100%)',
              border: 'none'
            }} onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? 'Mostrar Ativos' : 'Mostrar Inativos'}
          </button>
        </div>
      </div>
      {driversData.length === 0 && !loading ? (
        <div className="text-center my-4">Nenhum motorista cadastrado.</div>
      ) : (
        <DataTable
          columns={columns}
          data={driversData}
          onView={(driverTable) => {
            const driver = drivers.find(d => d.id === driverTable.id);
            if (driver) {
              const address = driver.address || {
                street: '',
                number: '',
                district: '',
                zipCode: '',
                city: '',
                state: ''
              };
              handleViewProfile({
                ...driver,
                address: {
                  ...address,
                  number: address.number !== undefined && address.number !== null ? String(address.number) : ''
                }
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
          headerGradient={{ start: '#843cf6', end: '#759bff' }}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentDriver ? 'Editar Motorista' : 'Adicionar Motorista'}
        size="xl"
      >
        <DriverForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <DriverViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        driver={viewDriver}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDriverToToggle(null);
        }}
        onConfirm={() => driverToToggle && updateDriverStatus(driverToToggle)}
        title="Inativar Motorista"
        message="Tem certeza que deseja inativar este Motorista?"
        subMessage="Esta ação não poderá ser desfeita."
        confirmText="Inativar"
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

export default Driver;