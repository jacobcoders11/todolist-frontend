"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import Sidebar from "../../../components/Sidebar";

export default function ManageTodos() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, todo: null });
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/admin/todos", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTodos(data.todos || []);
      } else {
        console.error("Error fetching todos:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTodo(todoId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/admin/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== todoId));
        setDeleteModal({ show: false, todo: null });
      } else {
        alert(data.error || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Failed to delete todo");
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed === 1;
    if (filter === 'pending') return todo.completed === 0;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab="all-todos" userType="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab="all-todos" userType="admin" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Todos</h1>
              <p className="text-gray-600 mt-2">{filteredTodos.length} todos</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Todo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTodos.map((todo) => (
                    <tr key={todo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {todo.completed ? (
                            <i className="bi bi-check-circle-fill text-xl text-green-500 mr-3"></i>
                          ) : (
                            <i className="bi bi-circle text-xl text-gray-300 mr-3"></i>
                          )}
                          <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}>
                            {todo.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{todo.user_name}</div>
                        <div className="text-sm text-gray-500">{todo.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(todo.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setDeleteModal({ show: true, todo })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-trash text-2xl text-red-500"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Todo</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "<strong>{deleteModal.todo?.title}</strong>"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, todo: null })}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTodo(deleteModal.todo.id)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}