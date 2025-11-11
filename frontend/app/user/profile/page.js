"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch user profile on load
    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/");
                return;
            }

            const response = await fetch("/api/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    phone_number: data.user.phone_number
                });
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

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

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                setIsEditing(false);
                fetchProfile(); // Refresh profile data

                // Update user in localStorage
                const storedUser = JSON.parse(localStorage.getItem("user"));
                localStorage.setItem("user", JSON.stringify({
                    ...storedUser,
                    name: formData.name,
                    email: formData.email
                }));
            } else {
                setErrors({ general: data.error || "Failed to update profile" });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrors({ general: "Network error. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Sidebar activeTab="profile" userType="user" />
                <main className="flex-1 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-blue-600"></span>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar activeTab="profile" userType="user" />

            <main className="flex-1 overflow-y-auto p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your account information</p>
                </div>

                <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
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

                    {!isEditing ? (
                        // View Mode
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                                <p className="text-base text-gray-900 mt-1.5">{user.name}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                                <p className="text-base text-gray-900 mt-1.5">{user.email}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                                <p className="text-base text-gray-900 mt-1.5">{user.phone_number}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</label>
                                <p className="text-base text-gray-900 mt-1.5">
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn bg-gradient-to-r from-slate-700 to-blue-900 hover:from-slate-800 hover:to-blue-950 text-white border-0"
                                >
                                    <i className="bi bi-pencil mr-2"></i>
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => router.push("/user/change-password")}
                                    className="btn btn-ghost border border-gray-200 hover:bg-gray-50"
                                >
                                    <i className="bi bi-key mr-2"></i>
                                    Change Password
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn bg-gradient-to-r from-slate-700 to-blue-900 hover:from-slate-800 hover:to-blue-950 text-white border-0"
                                >
                                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                            phone_number: user.phone_number
                                        });
                                        setErrors({});
                                    }}
                                    className="btn btn-ghost border border-gray-200 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}