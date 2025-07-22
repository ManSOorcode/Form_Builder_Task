import { Routes, Route, Navigate } from 'react-router';

import Builder from './pages/Builder';
import FormPage from './pages/FormPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/builder/:id" element={<Builder />} />
      <Route path="/form/:id" element={<FormPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
