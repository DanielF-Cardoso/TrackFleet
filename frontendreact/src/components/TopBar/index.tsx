import React from 'react';
import './styles.css';

interface TopBarProps {
  title: string;
  gradientStart?: string;
  gradientEnd?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  gradientStart = '#4a90e2', 
  gradientEnd = '#357abd',
  buttonText,
  onButtonClick,
  showButton = true
}) => {
  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`
  };

  return (
    <div className="barra-topo" style={gradientStyle}>
      <h2 className="titulo">{title}</h2>
      {showButton && (
        <button 
          className="btn-adicionar"
          onClick={onButtonClick}
        >
          <i className="fa fa-plus"></i>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default TopBar; 