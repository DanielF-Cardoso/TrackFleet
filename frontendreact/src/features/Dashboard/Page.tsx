import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/index';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [totalMotoristas, setTotalMotoristas] = useState<number>(1);
  const [totalFrotas, setTotalFrotas] = useState<number>(2);
  const [totalEventos, setTotalEventos] = useState<number>(3);
  const [totalGestor, setTotalGestor] = useState<number>(4);

  // Dados para o gráfico de eventos por tipo
  const eventosPorTipo = {
    labels: ['Entrega', 'Coleta', 'Manutenção', 'Outro'],
    datasets: [
      {
        label: 'Eventos por Tipo',
        data: [12, 8, 3, 2],
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384', '#FFCE56'],
        borderWidth: 0
      }
    ]
  };

  // Dados para o gráfico de eventos por mês
  const eventosPorMes = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Eventos Realizados',
        data: [5, 8, 12, 9, 7, 15],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36A2EB',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  // Dados para o gráfico de status da frota
  const statusFrota = {
    labels: ['Em Uso', 'Disponível', 'Manutenção'],
    datasets: [
      {
        data: [8, 5, 2],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: '#666'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      }
    }
  };

  return (
    <Layout>
          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-card gradient-purple">
                <div className="dashboard-card-content">
                  <div className="card-info">
                    <h6>Total de Motoristas</h6>
                    <h2>{totalMotoristas}</h2>
                  </div>
                  <div className="card-icon">
                    <i className="fa fa-id-card"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-card gradient-pink">
                <div className="dashboard-card-content">
                  <div className="card-info">
                    <h6>Total de Frotas</h6>
                    <h2>{totalFrotas}</h2>
                  </div>
                  <div className="card-icon">
                    <i className="fa fa-car"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-card gradient-orange">
                <div className="dashboard-card-content">
                  <div className="card-info">
                    <h6>Total de Eventos</h6>
                    <h2>{totalEventos}</h2>
                  </div>
                  <div className="card-icon">
                    <i className="fa fa-calendar"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-card gradient-blue">
                <div className="dashboard-card-content">
                  <div className="card-info">
                    <h6>Total de Gestor</h6>
                    <h2>{totalGestor}</h2>
                  </div>
                  <div className="card-icon">
                    <i className="fa fa-user"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table modern-table">
                  <thead className="table-header">
                    <tr>
                      <th>MOTORISTA</th>
                      <th>CARRO</th>
                      <th>ODÔMETRO</th>
                      <th>DATA INICIAL</th>
                      <th>DATA FINAL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>João Silva</td>
                      <td>Honda Civic</td>
                      <td>12.500</td>
                      <td>12/12/2023</td>
                      <td>12/01/2024</td>
                      <td>
                        <span className="status-dot active"></span>
                        Ativo
                      </td>
                    </tr>
                    <tr>
                      <td>Maria Santos</td>
                      <td>Toyota Corolla</td>
                      <td>15.300</td>
                      <td>15/12/2023</td>
                      <td>15/01/2024</td>
                      <td>
                        <span className="status-dot active"></span>
                        Ativo
                      </td>
                    </tr>
                    <tr>
                      <td>Pedro Oliveira</td>
                      <td>Fiat Strada</td>
                      <td>8.900</td>
                      <td>10/12/2023</td>
                      <td>10/01/2024</td>
                      <td>
                        <span className="status-dot active"></span>
                        Ativo
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ height: '350px' }}>
                    <Line data={eventosPorMes} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ height: '350px' }}>
                    <Doughnut data={statusFrota} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .dashboard-card {
            border-radius: 15px;
            padding: 20px;
            height: 100%;
            min-height: 120px;
            position: relative;
            overflow: hidden;
            transition: transform 0.2s;
          }

          .dashboard-card:hover {
            transform: translateY(-5px);
          }

          .dashboard-card-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 100%;
            position: relative;
            z-index: 1;
          }

          .card-info {
            color: white;
          }

          .card-info h6 {
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
            font-weight: 400;
          }

          .card-info h2 {
            font-size: 28px;
            margin: 0;
            font-weight: 600;
          }

          .card-icon {
            font-size: 24px;
            color: rgba(255, 255, 255, 0.5);
          }

          .card-icon i {
            font-size: 28px;
          }

          .gradient-purple {
            background: linear-gradient(135deg, #9f7aea 0%, #7c3aed 100%);
          }

          .gradient-pink {
            background: linear-gradient(135deg, #f472b6 0%, #db2777 100%);
          }

          .gradient-orange {
            background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
          }

          .gradient-blue {
            background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
          }

          .modern-table {
            color: #666;
            background: white;
            border-radius: 15px;
            overflow: hidden;
          }

          .modern-table thead th {
            background: #f1f5f9;
            border: none;
            padding: 15px 20px;
            font-weight: 600;
            color: #444;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .modern-table tbody td {
            padding: 15px 20px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
          }

          .status-dot.active {
            background-color: #22c55e;
          }

          .shadow-sm {
            box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
          }

          .card {
            background: white;
            border-radius: 15px;
            border: none;
          }

          .card-body {
            padding: 1.5rem;
          }

          .table-responsive {
            background: #f8f9fe;
            border-radius: 15px;
            padding: 0.5rem;
          }

          .modern-table {
            margin-bottom: 0;
            width: 100%;
          }

          .table-header {
            background: #7950f2;
            color: white;
          }

          .modern-table thead th {
            background: transparent;
            border: none;
            padding: 15px 20px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: white;
          }

          .modern-table tbody tr {
            background: white;
            margin-bottom: 5px;
            border-radius: 8px;
          }

          .modern-table tbody tr:not(:last-child) {
            border-bottom: 8px solid #f8f9fe;
          }

          .modern-table tbody td {
            padding: 15px 20px;
            border: none;
            background: white;
            vertical-align: middle;
            font-size: 14px;
            color: #666;
          }

          .modern-table tbody tr:first-child td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }

          .modern-table tbody tr:first-child td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }

          .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
          }

          .status-dot.active {
            background-color: #2ecc71;
          }
        `}
      </style>
    </Layout>
  );
};

export default Dashboard; 