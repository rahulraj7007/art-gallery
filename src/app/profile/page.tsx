// src/app/profile/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { User, Mail, Calendar, Package, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || ''
  });

  const handleSave = async () => {
    // TODO: Update user profile in Firebase
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      displayName: userProfile?.displayName || '',
      email: userProfile?.email || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    
    // Handle Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }
    
    // Handle date string
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    
    // Handle seconds timestamp (Unix timestamp)
    if (typeof dateValue === 'number') {
      return new Date(dateValue * 1000).toLocaleDateString();
    }
    
    // Handle object with seconds property (Firestore timestamp-like)
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString();
    }
    
    return 'N/A';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {userProfile?.displayName || 'User'}
                  </h2>
                  <p className="text-gray-600">{userProfile?.email}</p>
                  {userProfile?.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                      Administrator
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.displayName}
                        onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile?.displayName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </label>
                    <p className="text-gray-900">{userProfile?.email}</p>
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {formatDate(userProfile?.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Package className="inline h-4 w-4 mr-2" />
                      Total Orders
                    </label>
                    <p className="text-gray-900">{userProfile?.orders?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}