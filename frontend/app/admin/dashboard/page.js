"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token) {
          router.push("/");
          return;
        }

        if (user) {
          const userData = JSON.parse(user);
          setUserName(userData.name);
          
          // Check if user is admin
          if (userData.role !== 1) {
            router.push("/user/dashboard");
            return;
          }
        }

        const response = await fetch("/api/admin/stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStats(data.stats);
        } else {
          console.error("Error fetching stats:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab="admin-dashboard" userType="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab="admin-dashboard" userType="admin" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {userName}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Total Users
                  </h3>
                  <p className="text-4xl font-bold text-blue-500">{stats?.totalUsers || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-people text-2xl text-blue-500"></i>
                </div>
              </div>
            </div>

            {/* Total Todos Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Total Todos
                  </h3>
                  <p className="text-4xl font-bold text-green-500">{stats?.totalTodos || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-clipboard-check text-2xl text-green-500"></i>
                </div>
              </div>
            </div>

            {/* Completed Todos Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Completed
                  </h3>
                  <p className="text-4xl font-bold text-purple-500">{stats?.completedTodos || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-check-circle text-2xl text-purple-500"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {stats?.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}% completion rate
                </span>
              </div>
            </div>

            {/* Pending Todos Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Pending
                  </h3>
                  <p className="text-4xl font-bold text-orange-500">{stats?.pendingTodos || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-clock text-2xl text-orange-500"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <i className="bi bi-people text-xl text-blue-500 mr-3"></i>
                    <span className="font-medium text-gray-700">Manage Users</span>
                  </div>
                  <i className="bi bi-chevron-right text-gray-400"></i>
                </button>
                <button
                  onClick={() => router.push("/admin/todos")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <i className="bi bi-clipboard-check text-xl text-green-500 mr-3"></i>
                    <span className="font-medium text-gray-700">Manage Todos</span>
                  </div>
                  <i className="bi bi-chevron-right text-gray-400"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}