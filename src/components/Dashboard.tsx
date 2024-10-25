import React from 'react';
import { useAuthStore } from '../store/authStore';
import ExcelProcessor from './ExcelProcessor';
import UserManagement from './UserManagement';
import { ExcelData } from '../types';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [mainExcel, setMainExcel] = React.useState<ExcelData[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user?.username}</h1>
          <p className="text-gray-600">Rol: {user?.role}</p>
        </div>

        <ExcelProcessor mainExcel={mainExcel} setMainExcel={setMainExcel} />
        
        {user?.role === 'admin' && <UserManagement />}
      </div>
    </div>
  );
};

export default Dashboard;