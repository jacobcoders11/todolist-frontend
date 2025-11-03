"use client";
import { useState } from "react";
import {FaRegEnvelope} from "react-icons/fa";
import {MdLockOutline} from "react-icons/md";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
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
    
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    console.log("Form data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex">
        {/* Left Section - Login Form */}
        <div className="w-3/5 p-8">
          <div className="max-w-sm mx-auto">
            {/* Logo */}
            <div className="text-left mb-8">
              <h1 className="text-2xl font-bold">
                <span className="text-green-500">Todo</span>
                <span className="text-gray-800">List</span>
              </h1>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-green-500 hover:text-green-600 font-medium">
                  Forgot password?
                </a>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Right Section - Welcome */}
        <div className="w-2/5 bg-green-500 text-white flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
            <div className="w-12 h-0.5 bg-white/30 mx-auto mb-4"></div>
            <p className="text-green-100 mb-6 leading-relaxed">
              Enter your personal details and start your journey with us
            </p>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-500 px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
