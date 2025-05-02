import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { publicRoutes, privateRoutes } from './routes';
import NotFound from './pages/NotFound/NotFound';
import HomePage from './pages/HomePage';
import WOW from 'wow.js';
import 'animate.css';

function App() {
  const [user, setUser] = useState(null);

  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('User: ');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Lỗi khi parse dữ liệu user:', e);
      return null;
    }
  };

  useEffect(() => {
    new WOW().init();
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return <Navigate to="/not-found" replace />;
    }
    const hasPermission = currentUser.roles.some(role => allowedRoles.includes(role));
    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const TitleSetter = () => {
    const location = useLocation();
    const allPublicRoutes = publicRoutes;
    const currentRoute = allPublicRoutes.find(route => route.path === location.pathname);

    if (location.pathname.startsWith('/admin')) {
      return (
        <Helmet>
          <title>Luxstay - Bảng Điều Khiển Quản Trị</title>
        </Helmet>
      );
    }

    if (location.pathname === '/not-found' || !currentRoute) {
      return (
        <Helmet>
          <title>Luxstay - Ứng Dụng Quản Lý</title>
        </Helmet>
      );
    }

    return (
      <Helmet>
        <title>Luxstay - {currentRoute.title}</title>
      </Helmet>
    );
  };

  return (
    <Router>
      <div className="App">
        <TitleSetter />
        <Routes>
          <Route
            path="/"
            element={
              user && user.roles && user.roles.includes('ADMIN') ? (
                <Navigate to="/admin" replace />
              ) : (
                <div className="wow animate__animated animate__fadeIn">
                  <HomePage />
                </div>
              )
            }
          />

          {publicRoutes.map((route, index) => {
            if (route.path === '/') return null;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <div className="wow animate__animated animate__fadeIn">
                    <Page />
                  </div>
                }
              />
            );
          })}

          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <div className="wow animate__animated animate__fadeIn">
                      <Page />
                    </div>
                  </ProtectedRoute>
                }
              />
            );
          })}

          <Route
            path="/not-found"
            element={
              <div className="wow animate__animated animate__fadeIn">
                <NotFound />
              </div>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/not-found" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;