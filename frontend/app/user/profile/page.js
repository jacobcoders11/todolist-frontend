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
            <div className="flex h-screen bg-gray-100">
                <Sidebar activeTab="profile" userType="user" />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeTab="profile" userType="user" />

            <main className="flex-1 overflow-y-auto p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

                <div className="max-w-2xl bg-white rounded-lg shadow-lg p-6">
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

                    {!isEditing ? (
                        // View Mode
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <p className="text-lg text-gray-800">{user.name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg text-gray-800">{user.email}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                <p className="text-lg text-gray-800">{user.phone_number}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Member Since</label>
                                <p className="text-lg text-gray-800">
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            
                            <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => router.push("/user/change-password")}
                                className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Change Password
                            </button>
                            </div>
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
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
                                    className="px-6 py-2.5 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors"
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