import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { ProfileSchema } from '../../utils/validationSchemas';
import { toast } from 'react-toastify';
import {
    getProfile,
    updateProfile,
    updatePassword,
    updateAvatar,
    clearError,
    clearMessage
} from '../../store/slices/profileSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error, message } = useSelector((state) => state.profile);
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
        if (message) {
            toast.success(message);
            dispatch(clearMessage());
        }
    }, [error, message, dispatch]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
            await dispatch(updateAvatar(formData));
        }
    };

    const renderProfileTab = () => (
        <Formik
            initialValues={{
                name: profile?.name || '',
                email: profile?.email || '',
                bio: profile?.bio || '',
                website: profile?.website || '',
                location: profile?.location || '',
                phoneNumber: profile?.phoneNumber || ''
            }}
            validationSchema={ProfileSchema}
            onSubmit={async (values) => {
                await dispatch(updateProfile(values));
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img
                                src={avatarPreview || profile?.avatar || '/default-avatar.png'}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                        touched.name && errors.name ? 'border-red-500' : ''
                                    }`}
                                />
                                {touched.name && errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                        touched.email && errors.email ? 'border-red-500' : ''
                                    }`}
                                />
                                {touched.email && errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            value={values.bio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows="4"
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                touched.bio && errors.bio ? 'border-red-500' : ''
                            }`}
                        />
                        {touched.bio && errors.bio && (
                            <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={values.website}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                    touched.website && errors.website ? 'border-red-500' : ''
                                }`}
                            />
                            {touched.website && errors.website && (
                                <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={values.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                    touched.location && errors.location ? 'border-red-500' : ''
                                }`}
                            />
                            {touched.location && errors.location && (
                                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                    touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''
                                }`}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );

    const renderPasswordTab = () => (
        <Formik
            initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }}
            validationSchema={ProfileSchema}
            onSubmit={async (values, { resetForm }) => {
                await dispatch(updatePassword(values));
                resetForm();
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form className="space-y-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={values.currentPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                touched.currentPassword && errors.currentPassword ? 'border-red-500' : ''
                            }`}
                        />
                        {touched.currentPassword && errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={values.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                touched.newPassword && errors.newPassword ? 'border-red-500' : ''
                            }`}
                        />
                        {touched.newPassword && errors.newPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={values.confirmNewPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${
                                touched.confirmNewPassword && errors.confirmNewPassword ? 'border-red-500' : ''
                            }`}
                        />
                        {touched.confirmNewPassword && errors.confirmNewPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmNewPassword}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );

    if (!profile && loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-4 px-6 text-sm font-medium ${
                                activeTab === 'profile'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`py-4 px-6 text-sm font-medium ${
                                activeTab === 'password'
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Change Password
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' ? renderProfileTab() : renderPasswordTab()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
