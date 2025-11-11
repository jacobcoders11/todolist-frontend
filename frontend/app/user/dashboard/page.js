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
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab="dashboard" userType="user" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab="dashboard" userType="user" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600 mt-2">Here's your todo summary</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Todos Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Total Todos
                  </h3>
                  <p className="text-4xl font-bold text-green-500">{total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-clipboard-check text-2xl text-green-500"></i>
                </div>
              </div>
            </div>

            {/* Completed Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Completed
                  </h3>
                  <p className="text-4xl font-bold text-blue-500">{completed}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-check-circle text-2xl text-blue-500"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate
                </span>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                    Pending
                  </h3>
                  <p className="text-4xl font-bold text-orange-500">{pending}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-clock text-2xl text-orange-500"></i>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  {pending} {pending === 1 ? 'task' : 'tasks'} remaining
                </span>
              </div>
            </div>
          </div>

          {/* Recent Todos Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Todos</h2>
              <button
                onClick={() => router.push("/user/todos")}
                className="text-green-500 hover:text-green-600 text-sm font-medium"
              >
                View All →
              </button>
            </div>

            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="bi bi-inbox text-4xl mb-2"></i>
                <p>No todos yet. Start by creating your first todo!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.slice(0, 5).map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {todo.completed ? (
                      <i className="bi bi-check-circle-fill text-xl text-green-500 mr-3"></i>
                    ) : (
                      <i className="bi bi-circle text-xl text-gray-300 mr-3"></i>
                    )}
                    <span
                      className={`flex-1 ${todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                        }`}
                    >
                      {todo.title}
                    </span>
                    <span className="text-xs text-gray-400">
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