import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';

type RegistrationForm = {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  bloodType: string;
  membershipTier: 'regular' | 'overseas';
  country?: string;
};

export function Membership() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegistrationForm>({
    defaultValues: {
      membershipTier: 'regular'
    }
  });

  const membershipTier = watch('membershipTier');

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real app, we would upload the photo to Firebase Storage first
      // and get the URL to store in the document.
      
      await addDoc(collection(db, 'memberships'), {
        fullName: data.name, name: data.name, email: data.email, phone: data.phone,
        cnic: data.cnic, address: data.address, village: 'Jawkhela',
        bloodGroup: data.bloodType, bloodType: data.bloodType,
        membershipTier: data.membershipTier, country: data.country || '',
        status: 'Pending', createdAt: serverTimestamp(), profileImageUrl: '',
      });
      
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl p-10 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Thank you for applying to join Zwanan Jawkhela. Your application has been received and is currently under review by our administration.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 inline-block text-left">
            <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>Admin review usually takes 2-3 business days.</li>
              <li>You will receive an email notification upon approval.</li>
              <li>Once approved, your membership number and card will be generated.</li>
            </ul>
          </div>
          <div className="mt-10">
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Membership Application</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join Zwanan Jawkhela to stay connected with the community and participate in welfare activities.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-accent px-8 py-6 text-white">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-sm text-gray-300 mt-1">Please provide accurate information for verification.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {submitError && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p>{submitError}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input 
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input 
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                type="email"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
              <input 
                {...register('phone', { required: 'Phone is required' })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="+92 3XX XXXXXXX"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CNIC Number *</label>
              <input 
                {...register('cnic', { required: 'CNIC is required' })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="XXXXX-XXXXXXX-X"
              />
              {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Blood Type *</label>
              <select 
                {...register('bloodType', { required: 'Blood type is required' })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
              {errors.bloodType && <p className="text-red-500 text-xs mt-1">{errors.bloodType.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Membership Type *</label>
              <select 
                {...register('membershipTier')}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="regular">Local Member (Pakistan)</option>
                <option value="overseas">Overseas Member</option>
              </select>
            </div>

            {membershipTier === 'overseas' && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Current Country *</label>
                <input 
                  {...register('country', { required: membershipTier === 'overseas' ? 'Country is required' : false })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="E.g. UAE, Saudi Arabia, UK"
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Current Address *</label>
              <textarea 
                {...register('address', { required: 'Address is required' })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                placeholder="Full residential address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Note: For this prototype, image uploading is visual only.</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
