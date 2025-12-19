import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import CollabDashboard from './pages/collab/CollabDashboard';
import Register from './pages/Register';
import ResourceDetail from './pages/user/ResourceDetail';
import CollabResourceDetail from './pages/collab/CollabResourceDetail';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/collab" element={<CollabDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/resource/:id" element={<ResourceDetail />} />
        <Route path='/collab/resource/:id' element={<CollabResourceDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
