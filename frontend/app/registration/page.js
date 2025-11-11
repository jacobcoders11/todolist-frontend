"use client";
import { useState } from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { MdLockOutline, MdPhone } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Registration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: 2  // 2 = regular user
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowSuccess(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setErrors({ general: data.error || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl w-full flex flex-col-reverse lg:flex-row">
        {/* Left Section - Welcome */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-slate-700 to-blue-900 text-white flex items-center justify-center p-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Welcome Back!</h2>
            <div className="w-16 h-0.5 bg-white/30 mx-auto mb-6"></div>
            <p className="text-white/90 mb-8 leading-relaxed">
              Already have an account? Sign in to access your todos
            </p>
            <button 
              onClick={() => router.push("/")}
              className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-slate-700 hover:border-white"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-full lg:w-3/5 p-8 lg:p-12">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-700 to-blue-900 rounded-xl mb-4">
                <i className="bi bi-check2-square text-xl text-white"></i>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                TodoList
              </h1>
            </div>

            {/* Success Message */}
            {showSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Created!</h2>
                <p className="text-sm text-gray-500 mb-4">Your account has been created successfully.</p>
                <p className="text-xs text-gray-400 mb-4">Redirecting to sign in...</p>
                <span className="loading loading-spinner loading-md text-slate-700"></span>
              </div>
            ) : (
              <>
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h2>
                  <p className="text-sm text-gray-500">Get started with your free account</p>
                </div>
                
                {/* General Error Message */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.general}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 transition-all ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="text" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com" 
                      className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 transition-all ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone_number" 
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567" 
                      className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 transition-all ${errors.phone_number ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
                    />
                    {errors.phone_number && <p className="text-xs text-red-500 mt-1.5">{errors.phone_number}</p>}
                  </div>
                  
                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••" 
                      className={`input input-bordered w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-slate-700 focus:ring-2 focus:ring-slate-100 transition-all ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="btn w-full bg-gradient-to-r from-slate-700 to-blue-900 hover:from-slate-800 hover:to-blue-950 text-white border-0 shadow-sm mt-6"
                  >
                    {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}