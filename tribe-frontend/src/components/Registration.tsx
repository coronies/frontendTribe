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
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    university_id: '',
    role_id: 1, // default to student
    club_name: '',
    club_email: '',
    club_description: '',
    is_verified: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData | 'general', string>>>({});
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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Common validations
    if (role === 'student' && !formData.name) {
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

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.university_id || !selectedUniversity) {
      newErrors.university_id = 'Please select a university from the dropdown';
      isValid = false;
    }

    // Role-specific validations
    if (role === 'club_representative') {
      if (!formData.club_name) {
        newErrors.club_name = 'Club name is required';
        isValid = false;
      }
      if (!formData.club_email) {
        newErrors.club_email = 'Club email is required';
        isValid = false;
      }
      if (!formData.club_description) {
        newErrors.club_description = 'Club description is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setFormData(prev => ({
      ...prev,
      role_id: selectedRole === 'student' ? 1 : 2
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Form validation starting...');
    console.log('📋 Form data:', formData);
    console.log('🏫 Selected university:', selectedUniversity);
    
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
              {/* Left Column - Personal/Club Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {role === 'student' ? 'Personal Information' : 'Club Information'}
                </h3>

                {role === 'student' ? (
                  <>
                    <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                      rounded-2xl bg-gray-100 p-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                          text-gray-700 placeholder-gray-400 tracking-tight"
                        placeholder="Full Name"
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
                        placeholder="Email Address"
                        required
                      />
                    </div>
                    {errors.email && (
                      <div className="mt-2 text-red-600 text-sm">
                        {errors.email}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                      rounded-2xl bg-gray-100 p-2">
                      <input
                        type="text"
                        name="club_name"
                        value={formData.club_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                          text-gray-700 placeholder-gray-400 tracking-tight"
                        placeholder="Club Name"
                        required
                      />
                    </div>

                    <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                      rounded-2xl bg-gray-100 p-2">
                      <input
                        type="email"
                        name="club_email"
                        value={formData.club_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                          text-gray-700 placeholder-gray-400 tracking-tight"
                        placeholder="Club Email"
                        required
                      />
                    </div>

                    <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                      rounded-2xl bg-gray-100 p-2">
                      <textarea
                        name="club_description"
                        value={formData.club_description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                          text-gray-700 placeholder-gray-400 tracking-tight"
                        placeholder="Club Description"
                        required
                      />
                    </div>
                  </>
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
                
                <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                  rounded-2xl bg-gray-100 p-2">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                      text-gray-700 placeholder-gray-400 tracking-tight"
                    placeholder="Password"
                    required
                  />
                </div>
                {errors.password && (
                  <div className="mt-2 text-red-600 text-sm">
                    {errors.password}
                  </div>
                )}

                <div className="shadow-[inset_6px_6px_10px_0_rgba(0,0,0,0.1),inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)]
                  rounded-2xl bg-gray-100 p-2">
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0
                      text-gray-700 placeholder-gray-400 tracking-tight"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                {errors.confirm_password && (
                  <div className="mt-2 text-red-600 text-sm">
                    {errors.confirm_password}
                  </div>
                )}

                {role === 'club_representative' && (
                  <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
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