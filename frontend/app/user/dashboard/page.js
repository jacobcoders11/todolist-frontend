"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} userType="user" />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Todos</h3>
              <p className="text-3xl font-bold text-green-500">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-blue-500">8</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-orange-500">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}