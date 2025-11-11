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
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="all-todos" userType="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="all-todos" userType="admin" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Manage Todos</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredTodos.length} todos</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all' ? 'bg-gradient-to-r from-slate-700 to-blue-900 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-slate-50 border border-gray-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'completed' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-slate-50 border border-gray-100'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'pending' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-slate-50 border border-gray-100'}`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Todo</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTodos.map((todo) => (
                    <tr key={todo.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {todo.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{todo.user_name}</div>
                        <div className="text-sm text-gray-500">{todo.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${todo.completed ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDistanceToNow(new Date(todo.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setDeleteModal({ show: true, todo })}
                          className="text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <i className="bi bi-trash mr-1.5"></i> Delete
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-trash text-xl text-red-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Todo</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete "<strong>{deleteModal.todo?.title}</strong>"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, todo: null })}
                className="flex-1 btn btn-ghost border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTodo(deleteModal.todo.id)}
                className="flex-1 btn bg-red-600 hover:bg-red-700 text-white border-0"
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