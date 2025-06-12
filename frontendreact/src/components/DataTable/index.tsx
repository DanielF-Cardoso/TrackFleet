import React from 'react';
import './styles.css';

export interface DataTableColumn {
  label: string;
  field: string;
}

export interface StatusConfig {
  active: {
    value: string;
    badgeClass: string;
  };
  inactive: {
    value: string;
    badgeClass: string;
  };
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onToggleStatus?: (item: any) => void;
  statusField?: string;
  statusConfig?: StatusConfig;
  customActions?: (item: any) => React.ReactNode;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  headerGradient?: { start: string; end: string };
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  statusField = 'status',
  statusConfig = {
    active: {
      value: 'Ativo',
      badgeClass: 'badge-success'
    },
    inactive: {
      value: 'Inativo',
      badgeClass: 'badge-danger'
    }
  },
  customActions,
  tableClassName = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  headerGradient
}) => {
  return (
    <div className="table-responsive">
      <table className={`w-full bg-white rounded-lg shadow-lg ${tableClassName}`}>
        <thead className={headerClassName}>
          <tr
            style={headerGradient ? { background: `linear-gradient(to right, ${headerGradient.start}, ${headerGradient.end})` } : {}}
          >
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  background: 'transparent',
                  color: 'white',
                  borderColor: headerGradient ? headerGradient.end : undefined,
                }}
              >
                {column.label}
              </th>
            ))}
            <th
              style={{
                background: 'transparent',
                color: 'white',
                borderColor: headerGradient ? headerGradient.end : undefined,
              }}
            >
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item.id} className={rowClassName}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`text-center align-middle ${cellClassName}`}>
                  {column.field === statusField ? (
                    <span className={`badge ${item[statusField] === statusConfig.active.value
                      ? statusConfig.active.badgeClass
                      : statusConfig.inactive.badgeClass
                      }`}>
                      {item[statusField]}
                    </span>
                  ) : (
                    item[column.field]
                  )}
                </td>
              ))}
              <td className={`text-center align-middle ${cellClassName}`}>
                <div className="action-buttons">
                  {onView && (
                    <button
                      className="btn-icon"
                      onClick={() => onView(item)}
                      title="Visualizar"
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="btn-icon"
                      onClick={() => onEdit(item)}
                      title="Editar"
                      disabled={item[statusField] === statusConfig.inactive.value}
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                  )}
                  {onToggleStatus && (
                    <button
                      className={`btn-icon ${item[statusField] === statusConfig.active.value
                        ? 'text-danger'
                        : 'text-success'
                        }`}
                      onClick={() => onToggleStatus(item)}
                      title={
                        item[statusField] === statusConfig.active.value
                          ? 'Inativar'
                          : 'Ativar'
                      }
                    >
                      <i className={`fa ${item[statusField] === statusConfig.active.value
                        ? 'fa-ban'
                        : 'fa-check-circle'
                        }`}></i>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-icon text-danger"
                      onClick={() => onDelete(item)}
                      title="Deletar"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                  {customActions && customActions(item)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 