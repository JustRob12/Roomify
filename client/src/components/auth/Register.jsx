import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register as registerUser } from '../../services/api';

const baseSchema = {
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string(),
  username: yup.string().required('Username is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
};

const studentSchema = yup.object().shape({
  ...baseSchema,
  studentId: yup.string().required('Student ID is required'),
  year: yup.string().required('Year is required'),
  course: yup.string().required('Course is required'),
});

const facultySchema = yup.object().shape({
  ...baseSchema,
  facultyId: yup.string().required('Faculty ID is required'),
  faculty: yup.string().required('Faculty is required'),
});

const adminSchema = yup.object().shape({
  ...baseSchema,
});

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [schema, setSchema] = useState(studentSchema);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', isError: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const showAlert = (message, isError = false) => {
    setAlert({ show: true, message, isError });
    setTimeout(() => setAlert({ show: false, message: '', isError: false }), 5000);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    switch (type) {
      case 'student':
        setSchema(studentSchema);
        break;
      case 'faculty':
        setSchema(facultySchema);
        break;
      default:
        setSchema(adminSchema);
    }
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const userData = {
        ...data,
        role: userType.charAt(0).toUpperCase() + userType.slice(1),
      };
      await registerUser(userData);
      showAlert('Registration successful!', false);
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      showAlert(error.message || 'Registration failed', true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {alert.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          alert.isError ? 'bg-red-100 text-red-700' : 'bg-black text-white'
        }`}>
          {alert.message}
        </div>
      )}
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account 
          </h2>
        </div>

        <div className="flex space-x-4 mb-6">
          {['student', 'faculty', 'admin'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleUserTypeChange(type)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize ${
                userType === type
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                Middle Name (Optional)
              </label>
              <input
                type="text"
                {...register('middleName')}
                className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Middle name"
              />
            </div>

            {userType === 'student' && (
              <>
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    Student ID
                  </label>
                  <input
                    type="text"
                    {...register('studentId')}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Student ID"
                  />
                  {errors.studentId && (
                    <p className="mt-2 text-sm text-red-600">{errors.studentId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <select
                    {...register('year')}
                    className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && (
                    <p className="mt-2 text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                    Course
                  </label>
                  <input
                    type="text"
                    {...register('course')}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Course"
                  />
                  {errors.course && (
                    <p className="mt-2 text-sm text-red-600">{errors.course.message}</p>
                  )}
                </div>
              </>
            )}

            {userType === 'faculty' && (
              <>
                <div>
                  <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700">
                    Faculty ID
                  </label>
                  <input
                    type="text"
                    {...register('facultyId')}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Faculty ID"
                  />
                  {errors.facultyId && (
                    <p className="mt-2 text-sm text-red-600">{errors.facultyId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                    Faculty
                  </label>
                  <input
                    type="text"
                    {...register('faculty')}
                    className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Faculty"
                  />
                  {errors.faculty && (
                    <p className="mt-2 text-sm text-red-600">{errors.faculty.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                {...register('username')}
                className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create Account
            </button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
