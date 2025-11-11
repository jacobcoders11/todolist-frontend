"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeTab, userType = "user" }) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Load user info from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        name: user.name,
        email: user.email,
        initial: user.name.charAt(0).toUpperCase(),
        bgColor: user.role === 1 ? "bg-gradient-to-br from-slate-700 to-blue-900" : "bg-slate-500"
      });
    }
  }, []);

  // Define menu items based on user type
  const getMenuItems = () => {
    if (userType === "admin") {
      return [
        { name: 'Admin Dashboard', href: '/admin/dashboard', icon: 'bi-speedometer2' },
        { name: 'Manage Users', href: '/admin/users', icon: 'bi-people' },
        { name: 'Manage Todos', href: '/admin/todos', icon: 'bi-clipboard-check' },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/user/dashboard', icon: 'bi-speedometer2' },
        { name: 'My Todos', href: '/user/todos', icon: 'bi-clipboard-check' },
        { name: 'My Profile', href: '/user/profile', icon: 'bi-person' },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (item) => {
    router.push(item.href);
  };

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Close modal
    setShowSignOutModal(false);
    // Redirect to login
    router.push('/');
  };

  // Show loading state while fetching user info
  if (!userInfo) {
    return (
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            <span className="text-slate-700">Todo</span>
            <span className="text-gray-800">List</span>
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-blue-900 rounded-xl flex items-center justify-center shadow-sm">
              <i className="bi bi-check2-square text-lg text-white"></i>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              TodoList
            </h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = activeTab === item.name.toLowerCase().replace(/\s+/g, '-');

              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                    isActive 
                      ? 'bg-slate-100 text-slate-800 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg`}></i>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 p-2">
            <div className={`w-9 h-9 ${userInfo.bgColor} rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
              {userInfo.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userInfo.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 py-2.5 rounded-lg transition-all font-medium"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-box-arrow-right text-xl text-red-600"></i>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Sign Out
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to sign out of your account?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 btn btn-ghost border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}