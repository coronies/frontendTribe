import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUniversities } from '../hooks/useUniversities';
import type { RegisterData } from '../contexts/types';
import type { University } from '../contexts/universityTypes';
import { useFlip } from './AuthCard';
import { LoadingSpinner } from './LoadingSpinner';

type UserRole = 'student' | 'club_representative';

export function Registration() {
  const [role, setRole] = useState<UserRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    university_id: '',
    role_id: 0, // 0 - student, 2 - club representative
    is_verified: true, // students are verified by default
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData | 'confirm_password' | 'general', string>>>({});
  const { register, loading, error } = useAuth();
  const { universities, isLoading: universitiesLoading } = useUniversities(searchQuery);
  const navigate = useNavigate();
  const { setIsFlipped } = useFlip();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.university-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university);
    setFormData(prev => ({
      ...prev,
      university_id: university.id
    }));
    setShowDropdown(false);
    setSearchQuery(university.name);
  };

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setFormData(prev => ({
      ...prev,
      role_id: selectedRole === 'student' ? 0 : 2, // 0 for student, 2 for club representative
      is_verified: selectedRole === 'student' ? true : false // Students auto-verified, clubs choose
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.university_id || !selectedUniversity) {
      newErrors.university_id = 'Please select a university from the dropdown';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirm_password') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear field-specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Form validation starting...');
    console.log('📋 Form data:', formData);
    console.log('🏫 Selected university:', selectedUniversity);
    console.log('👤 Selected role:', role, 'role_id:', formData.role_id);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    console.log('✅ Form validation passed, submitting...');

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      console.log('❌ Registration error:', err);
      setErrors(prev => ({
        ...prev,
        general: err.message || 'Registration failed. Please try again.'
      }));
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the Tribe platform to connect with clubs and opportunities
        </p>
      </div>

      <div className="mt-8 w-full">
        <div className="bg-white py-8 px-6 shadow-auth rounded-lg">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 font-mono">
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                    role === 'student'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('club_representative')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                    role === 'club_representative'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🏢 Club Representative
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h3>

                <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                  rounded-2xl bg-gray-100 p-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                      text-gray-700 placeholder-gray-400 tracking-tight"
                    placeholder={role === 'club_representative' ? 'Your Full Name' : 'Full Name'}
                    required
                  />
                </div>
                {errors.name && (
                  <div className="mt-2 text-red-600 text-sm">
                    {errors.name}
                  </div>
                )}

                <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                  rounded-2xl bg-gray-100 p-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                      text-gray-700 placeholder-gray-400 tracking-tight"
                    placeholder={role === 'club_representative' ? 'Your Email Address' : 'Email Address'}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 text-red-600 text-sm">
                    {errors.email}
                  </div>
                )}

                <div className="relative university-dropdown">
                  <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                    rounded-2xl bg-gray-100 p-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                        text-gray-700 placeholder-gray-400 tracking-tight"
                      placeholder="Search for your university..."
                    />
                  </div>

                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg max-h-60 overflow-auto">
                      {universitiesLoading ? (
                        <div className="p-4 text-center">
                          <LoadingSpinner />
                        </div>
                      ) : universities.length > 0 ? (
                        <ul className="py-2">
                          {universities.map((university: University) => (
                            <li
                              key={university.id}
                              onClick={() => handleUniversitySelect(university)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                            >
                              {university.name} - {university.location}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          {searchQuery.trim() ? 'No universities found' : 'Start typing to search'}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedUniversity && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                      Selected: {selectedUniversity.name}
                    </div>
                  )}
                  
                  {errors.university_id && (
                    <div className="mt-2 text-red-600 text-sm">
                      {errors.university_id}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Account Security */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                
                <div className="relative">
                  <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                    rounded-2xl bg-gray-100 p-2">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-transparent border-none focus:ring-0
                        text-gray-700 placeholder-gray-400 tracking-tight"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 
                        p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.243 4.243L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-2 text-red-600 text-sm">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                    rounded-2xl bg-gray-100 p-2">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 bg-transparent border-none focus:ring-0
                        text-gray-700 placeholder-gray-400 tracking-tight"
                      placeholder="Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 
                        p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.243 4.243L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <div className="mt-2 text-red-600 text-sm">
                      {errors.confirm_password}
                    </div>
                  )}
                </div>

                {role === 'club_representative' && (
                  <div className="bg-gray-900 text-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center">
                      🏆 Official Club Verification
                    </h4>
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_verified"
                          checked={formData.is_verified}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">My club is officially recognized by the university</span>
                      </label>
                    </div>
                    <div className="mt-4 text-sm text-gray-300">
                      <p className="font-medium mb-2">Benefits of verification:</p>
                      <ul className="space-y-1">
                        <li>• Display verification badge</li>
                        <li>• Increased student trust and engagement</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="flex-1 py-3 px-4 bg-gray-800 text-white font-medium rounded-xl
                  transition-all duration-200 tracking-tight"
              >
                Log in
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gray-800 text-white font-medium rounded-xl
                  shadow-[inset_6px_6px_12px_#1f2937,inset_-6px_-6px_12px_#374151]
                  hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  tracking-tight"
              >
                {loading ? <LoadingSpinner /> : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}