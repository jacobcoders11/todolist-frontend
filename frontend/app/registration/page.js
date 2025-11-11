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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        {/* Left Section - Welcome */}
        <div className="w-2/5 bg-green-500 text-white flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <div className="w-12 h-0.5 bg-white/30 mx-auto mb-4"></div>
            <p className="text-green-100 mb-6 leading-relaxed">
              Already have an account? Sign in to access your todos
            </p>
            <button 
              onClick={() => router.push("/")}
              className="border-2 border-white text-white hover:bg-white hover:text-green-500 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-3/5 p-8">
          <div className="max-w-sm mx-auto">
            {/* Logo */}
            <div className="text-left mb-8">
              <h1 className="text-2xl font-bold">
                <span className="text-green-500">Todo</span>
                <span className="text-gray-800">List</span>
              </h1>
            </div>

            {/* Success Message */}
            {showSuccess ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                  <p className="text-gray-500 text-sm mb-4">Your account has been created successfully.</p>
                  <p className="text-gray-400 text-xs">Redirecting to login page...</p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                  <p className="text-gray-500 text-sm">Sign up to get started</p>
                </div>
                
                {/* General Error Message */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {errors.general}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name Input */}
                  <div>
                    <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.name ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                      <div className="flex items-center p-4">
                        <FaRegUser className="text-gray-400 mr-3 text-sm"/>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name" 
                          className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name}</p>}
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.email ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                      <div className="flex items-center p-4">
                        <FaRegEnvelope className="text-gray-400 mr-3 text-sm"/>
                        <input 
                          type="text" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email address" 
                          className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.phone_number ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                      <div className="flex items-center p-4">
                        <MdPhone className="text-gray-400 mr-3 text-sm"/>
                        <input 
                          type="tel" 
                          name="phone_number" 
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="Phone Number" 
                          className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                    {errors.phone_number && <p className="text-red-500 text-xs mt-2 ml-1">{errors.phone_number}</p>}
                  </div>
                  
                  {/* Password Input */}
                  <div>
                    <div className={`relative bg-gray-50 rounded-xl transition-all duration-200 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 ${errors.password ? 'ring-2 ring-red-500/20 bg-red-50' : ''}`}>
                      <div className="flex items-center p-4">
                        <MdLockOutline className="text-gray-400 mr-3 text-sm"/>
                        <input 
                          type="password" 
                          name="password" 
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password" 
                          className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>}
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
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