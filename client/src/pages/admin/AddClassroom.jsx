import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../services/api';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Classroom name is required'),
  capacity: yup.number()
    .required('Capacity is required')
    .positive('Capacity must be positive')
    .integer('Capacity must be a whole number'),
  grade: yup.string().required('Grade is required'),
  section: yup.string().required('Section is required'),
  description: yup.string().required('Description is required'),
});

const AddClassroom = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/api/classrooms', data);
      toast.success('Classroom created successfully!');
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating classroom');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Classroom</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Classroom Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="e.g., Room 101"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <select
            {...register('grade')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
          >
            <option value="">Select Grade</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <input
            type="text"
            {...register('section')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="e.g., A, B, C"
          />
          {errors.section && (
            <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capacity</label>
          <input
            type="number"
            {...register('capacity')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            placeholder="Maximum number of students"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
            rows="4"
            placeholder="Classroom description"
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
            Create Classroom
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassroom;
