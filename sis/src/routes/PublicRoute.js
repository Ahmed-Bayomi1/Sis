import { Navigate, Outlet } from 'react-router-dom';

const ROLE_HOME_MAP = {
  student: '/HomeStudent',
  doctor:  '/HomeDoctor',
  affairs: '/HomeAffaris',
};

export default function PublicRoute() {
  const token = localStorage.getItem('token');
  const role  = (localStorage.getItem('userRole') || '').toLowerCase();

  // Only redirect if token AND a known role exist
  if (token && ROLE_HOME_MAP[role]) {
    return <Navigate to={ROLE_HOME_MAP[role]} replace />;
  }

  return <Outlet />;
}