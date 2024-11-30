import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Subject name is required'),
  code: yup.string()
    .required('Subject code is required')
    .matches(/^[A-Z]{2,4}[0-9]{3,4}$/, 'Invalid subject code format (e.g., CS101)'),
  description: yup.string().required('Description is required'),
  credits: yup.number()
    .required('Credits are required')
    .positive('Credits must be positive')
    .integer('Credits must be a whole number'),
  department: yup.string().required('Department is required'),
});

const AddSubject = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/subjects', data);
      toast.success('Subject created successfully!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating subject');
    }
  };

  const departments = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Computer Science',
    'Physical Education',
    'Art',
    'Music',
    'Foreign Languages',
    'Social Studies'
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Subject</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Subject Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="e.g., Advanced Mathematics"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject Code</label>
          <input
            type="text"
            {...register('code')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="e.g., MATH101"
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            {...register('department')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Credits</label>
          <input
            type="number"
            {...register('credits')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Number of credits"
          />
          {errors.credits && (
            <p className="text-red-500 text-sm mt-1">{errors.credits.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            rows="4"
            placeholder="Subject description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Create Subject
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubject;
