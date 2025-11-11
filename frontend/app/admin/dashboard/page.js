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
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="admin-dashboard" userType="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeTab="admin-dashboard" userType="admin" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {userName}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <i className="bi bi-people text-2xl text-slate-700"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Todos Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <i className="bi bi-clipboard-check text-2xl text-slate-700"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Todos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalTodos || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Todos Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <i className="bi bi-check-circle text-2xl text-slate-700"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.completedTodos || 0}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-slate-700 h-1.5 rounded-full transition-all" 
                          style={{width: `${stats?.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%`}}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        {stats?.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Todos Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <i className="bi bi-clock text-2xl text-orange-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pendingTodos || 0}</p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {stats?.pendingTodos} {stats?.pendingTodos === 1 ? 'task' : 'tasks'} remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/admin/users")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <i className="bi bi-people text-lg text-slate-700"></i>
                    </div>
                    <span className="font-medium text-gray-700 ml-3">Manage Users</span>
                  </div>
                  <i className="bi bi-chevron-right text-gray-400 group-hover:text-slate-700 transition-colors"></i>
                </button>
                <button
                  onClick={() => router.push("/admin/todos")}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <i className="bi bi-clipboard-check text-lg text-slate-700"></i>
                    </div>
                    <span className="font-medium text-gray-700 ml-3">Manage Todos</span>
                  </div>
                  <i className="bi bi-chevron-right text-gray-400 group-hover:text-slate-700 transition-colors"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}