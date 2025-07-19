import type { RootState } from '../redux/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

interface ProtectedUserRouteProps {
  children?: React.ReactNode;
}

export function ProtectedUserRoute({ children }: ProtectedUserRouteProps) {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // or a loading spinner
  }

  return children ? children : <Outlet />; // Use Outlet for nested routes
}