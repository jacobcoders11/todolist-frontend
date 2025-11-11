"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import Sidebar from "../../../components/Sidebar";

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
    }
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        console.error("Error fetching users:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteUser(userId) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        setDeleteModal({ show: false, user: null });
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="manage-users" userType="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab="manage-users" userType="admin" />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">{users.length} total users</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${user.role === 1 ? 'bg-gradient-to-br from-slate-700 to-blue-900' : 'bg-slate-400'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${user.role === 1 ? 'bg-slate-100 text-slate-800' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role === 1 ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.id === currentUserId ? (
                          <span className="text-gray-400 italic text-xs">
                            Your account
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeleteModal({ show: true, user })}
                            className="text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 hover:bg-red-50 rounded-lg"
                          >
                            <i className="bi bi-trash mr-1.5"></i> Delete
                          </button>
                        )}
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
              <i className="bi bi-exclamation-triangle text-xl text-red-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="flex-1 btn btn-ghost border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteModal.user.id)}
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