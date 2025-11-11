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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeTab="change-password" userType="user" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Change Password</h1>
          <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
        </div>

        <div className="max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm flex items-start gap-2">
              <i className="bi bi-check-circle text-green-600 text-lg shrink-0"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <i className="bi bi-exclamation-circle text-red-600 text-lg shrink-0"></i>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 ${errors.currentPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
              />
              {errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1.5">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password (min 6 characters)"
                className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 ${errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1.5">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full bg-gradient-to-r from-slate-700 to-blue-900 hover:from-slate-800 hover:to-blue-950 text-white border-0 mt-6"
            >
              {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}