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
        bgColor: user.role === 1 ? "bg-blue-500" : "bg-green-500"
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
            <span className="text-green-500">Todo</span>
            <span className="text-gray-800">List</span>
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            <span className="text-green-500">Todo</span>
            <span className="text-gray-800">List</span>
          </h1>
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
                    className={`w-full flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150 rounded-md px-3 py-2.5 text-sm cursor-pointer ${isActive ? 'text-gray-900 bg-gray-100 font-bold' : ''
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
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{userInfo.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSignOutModal(true)}
            className="w-full text-red-500 hover:text-red-600 text-sm font-medium py-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-start px-3"
          >
            <i className="bi bi-box-arrow-right mr-2"></i>
            Sign Out
          </button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
            {/* Icon */}
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-box-arrow-right text-2xl text-red-500"></i>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Sign Out
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to sign out of your account?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
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