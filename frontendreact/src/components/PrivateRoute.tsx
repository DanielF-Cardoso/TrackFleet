import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCookies } from 'react-cookie';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [cookies] = useCookies(['TrackFleetToken']);

  console.log('PrivateRoute - Estado de autenticação:', {
    isAuthenticated,
    user,
    path: location.pathname,
    token: cookies.TrackFleetToken // Agora mostra o token do cookie
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};