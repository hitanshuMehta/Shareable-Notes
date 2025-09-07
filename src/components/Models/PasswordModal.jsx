import React, { useState, useEffect } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordModal({ isOpen, onClose, onSubmit, mode, title }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (mode === 'create') {
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiLock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{title}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 sm:pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Enter password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Confirm password"
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
              >
                {mode === 'create' ? 'Set Password' : 'Unlock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
