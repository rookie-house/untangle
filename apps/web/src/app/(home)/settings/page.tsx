'use client';

import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff, Info } from 'lucide-react';
import Image from 'next/image';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Kowalski',
    email: 'j.kowalski@gmail.com',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    offers: false,
    tailored: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (key: 'offers' | 'tailored') => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6 mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Explore content more deeply and effectively.</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-3xl p-8 space-y-12">
        {/* Profile Section */}
        <div className="space-y-6">
          {/* Timeline Indicator */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-0.5 h-24 bg-gray-200 my-2"></div>
            </div>

            <div className="flex-1 space-y-6">
              {/* Section Title */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-gray-500 text-sm">Personal details</p>
              </div>

              {/* Profile Content */}
              <div className="flex gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">JK</span>
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-6">
                  {/* First and Last Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">E-mail address</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        Email Verified
                      </span>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Enter New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last password change: 04.08.2021</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-6">
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>

            <div className="flex-1 space-y-6">
              {/* Section Title */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-gray-500 text-sm">
                  By checking the boxes, you accept the{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-4">
                {/* Offers Toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <label className="text-gray-900 font-medium cursor-pointer">
                    I want to receive information about current offers and promotions
                  </label>
                  <button
                    onClick={() => handleNotificationChange('offers')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.offers ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.offers ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Tailored Offers Toggle */}
                <div className="flex items-center justify-between pb-4">
                  <label className="text-gray-900 font-medium cursor-pointer">
                    I want to receive an offer tailored to my needs
                  </label>
                  <button
                    onClick={() => handleNotificationChange('tailored')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.tailored ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.tailored ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Newsletter Confirmation Card */}
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Confirm your newsletter subscription
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      We sent a message to your email j.kowalski@gmail.com confirming your
                      newsletter signup.
                    </p>
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                      Resend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
          Save changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
