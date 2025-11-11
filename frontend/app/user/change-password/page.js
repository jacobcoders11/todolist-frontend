"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { MdLockOutline } from "react-icons/md";

export default function ChangePassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validate
    if (!formData.currentPassword) {
      setErrors({ currentPassword: "Current password is required" });
      return;
    }

    if (!formData.newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: "New password must be at least 6 characters" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/users/me/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setErrors({ general: data.error || "Failed to change password" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab="change-password" userType="user" />

      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Change Password</h1>

        <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.currentPassword ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                <div className="flex items-center p-4">
                  <MdLockOutline className="text-gray-400 mr-3 text-sm"/>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-2 ml-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.newPassword ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                <div className="flex items-center p-4">
                  <MdLockOutline className="text-gray-400 mr-3 text-sm"/>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password (min 6 characters)"
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-2 ml-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.confirmPassword ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                <div className="flex items-center p-4">
                  <MdLockOutline className="text-gray-400 mr-3 text-sm"/>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}