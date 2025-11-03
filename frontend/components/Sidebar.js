"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeTab, userType = "user" }) {
  const router = useRouter();
  
  // Define menu items based on user type
  const getMenuItems = () => {
    if (userType === "admin") {
      return [
        { name: 'Admin Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
        { name: 'Manage Users', href: '/admin/users', icon: 'bi-people' },
        { name: 'All Todos', href: '/admin/todos', icon: 'bi-clipboard-check' },
        { name: 'Analytics', href: '/admin/analytics', icon: 'bi-graph-up' },
        { name: 'System Settings', href: '/admin/settings', icon: 'bi-gear' },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/user/dashboard', icon: 'bi-speedometer2' },
        { name: 'My Todos', href: '/user/todos', icon: 'bi-clipboard-check' },
        { name: 'Completed', href: '/user/completed', icon: 'bi-check-circle' },
        { name: 'My Profile', href: '/user/profile', icon: 'bi-person' },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (item) => {
    router.push(item.href);
  };

  // Get user info based on user type
  const getUserInfo = () => {
    if (userType === "admin") {
      return {
        name: "Admin User",
        email: "admin@todolist.com",
        initial: "A",
        bgColor: "bg-red-500"
      };
    } else {
      return {
        name: "User Name",
        email: "user@email.com",
        initial: "U",
        bgColor: "bg-green-500"
      };
    }
  };

  const userInfo = getUserInfo();

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">
          <span className="text-green-500">Todo</span>
          <span className="text-gray-800">List</span>
        </h1>
        {userType === "admin" && (
          <p className="text-xs text-red-500 font-medium mt-1">Admin Panel</p>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = activeTab === item.name.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 rounded-md px-3 py-2.5 text-sm cursor-pointer ${
                    isActive ? 'text-gray-900 bg-gray-100 font-bold' : ''
                  }`}
                >
                  <div className="flex justify-center shrink-0 w-6">
                    <i className={`bi ${item.icon} text-base ${isActive ? 'font-black text-black drop-shadow-md' : ''}`}></i>
                  </div>
                  <span className="ml-3">{item.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${userInfo.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
            {userInfo.initial}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{userInfo.name}</p>
            <p className="text-xs text-gray-500">{userInfo.email}</p>
          </div>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="w-full text-red-500 hover:text-red-600 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}