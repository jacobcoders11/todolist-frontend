"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import Sidebar from "../../../components/Sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  // When page loads, get all todos from API
  useEffect(() => {
    async function fetchTodos() {
      try {
        // Get token and user from localStorage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token) {
          router.push("/");
          return;
        }

        if (user) {
          const userData = JSON.parse(user);
          setUserName(userData.name);
        }

        // Fetch todos with authentication
        const response = await fetch("/api/todos", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setTodos(data.todos || []);
        } else {
          console.error("Error fetching todos:", data.error);
          setTodos([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
  }, [router]);

  // Count total todos
  const total = todos.length;

  // Count pending (not completed)
  const pending = todos.filter((todo) => !todo.completed).length;

  // Count completed
  const completed = todos.filter((todo) => todo.completed).length;

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="dashboard" userType="user" />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeTab="dashboard" userType="user" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's your todo summary for today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Todos Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <i className="bi bi-clipboard-check text-2xl text-slate-700"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Todos</p>
                    <p className="text-2xl font-bold text-gray-900">{total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <i className="bi bi-check-circle text-2xl text-slate-700"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completed}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-slate-700 h-1.5 rounded-full transition-all" 
                          style={{width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%`}}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        {total > 0 ? Math.round((completed / total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <i className="bi bi-clock text-2xl text-orange-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{pending}</p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {pending} {pending === 1 ? 'task' : 'tasks'} remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Todos Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Recent Todos</h2>
              <button
                onClick={() => router.push("/user/todos")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <i className="bi bi-arrow-right text-sm"></i>
              </button>
            </div>

            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-inbox text-2xl text-gray-400"></i>
                </div>
                <p className="text-sm text-gray-500">No todos yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first todo to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todos.slice(0, 5).map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                  >
                    <div className="shrink-0">
                      {todo.completed ? (
                        <div className="w-5 h-5 bg-green-700 rounded-full flex items-center justify-center shadow-sm">
                          <i className="bi bi-check text-base text-white font-bold"></i>
                        </div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-slate-700 transition-colors"></div>
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {formatDistanceToNow(new Date(todo.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}