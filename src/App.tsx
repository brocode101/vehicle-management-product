import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { VehicleListGrid } from './components/VehicleListGrid';
import { VehicleEditForm } from './components/VehicleEditForm';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<VehicleListGrid />} />
            <Route path="/vehicles/edit/:id" element={<VehicleEditForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
