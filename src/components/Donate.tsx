import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Copy, CheckCircle2, Heart, Building2, Smartphone } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

type DonationForm = {
  donorName: string;
  contactPhone: string;
  amount: number;
  method: 'bank' | 'easypaisa' | 'cash';
  purpose: 'community-fund' | 'emergency' | 'specific-project';
};

export function Donate() {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedEasyPaisa, setCopiedEasyPaisa] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DonationForm>();

  const copyToClipboard = (text: string, type: 'bank' | 'easypaisa') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedEasyPaisa(true);
      setTimeout(() => setCopiedEasyPaisa(false), 2000);
    }
  };

  const onSubmit = async (data: DonationForm) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'donations'), {
        ...data,
        amount: Number(data.amount),
        date: serverTimestamp(),
        status: 'pending',
        receiptUrl: '',
      });
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error recording donation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Heart size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Cause</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your donations empower Zwanan Jawkhela to provide emergency relief, support education, and drive community welfare projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Payment Details */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4">Donation Methods</h2>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-accent px-6 py-4 flex items-center gap-3 text-white">
              <Building2 size={24} />
              <h3 className="text-lg font-semibold">Direct Bank Transfer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                  <p className="font-semibold text-gray-900 text-lg">UBL (United Bank Limited)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Branch Code</p>
                  <p className="font-semibold text-gray-900">1398</p>
                </div>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 mb-1">Account Title</p>
                <p className="font-semibold text-gray-900 text-lg">Aziz Ul Haq</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                <p className="font-mono text-gray-900 text-lg">253566694</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">IBAN</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono font-semibold text-gray-900 text-lg break-all">PK62UNIL0109000253566694</p>
                  <button 
                    onClick={() => copyToClipboard('PK62UNIL0109000253566694', 'bank')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copy IBAN"
                  >
                    {copiedBank ? <CheckCircle2 size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-600" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-primary px-6 py-4 flex items-center gap-3 text-white">
              <Smartphone size={24} />
              <h3 className="text-lg font-semibold">Easypaisa</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500 mb-1">Account Title</p>
                <p className="font-semibold text-gray-900 text-lg">Azizul Haq</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                <div className="flex items-center gap-3">
                  <p className="font-mono font-semibold text-gray-900 text-2xl">0342-9395868</p>
                  <button 
                    onClick={() => copyToClipboard('03429395868', 'easypaisa')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copy Number"
                  >
                    {copiedEasyPaisa ? <CheckCircle2 size={20} className="text-green-600" /> : <Copy size={20} className="text-gray-600" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Record Donation Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">Record Your Donation</h2>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Donation Recorded!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your generous support. Your donation record has been submitted and is pending confirmation by our finance team. You will receive an official receipt shortly.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Submit Another Record
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <p className="text-gray-600 mb-6">
                Already transferred? Fill out this form so our team can verify your transaction and generate an official receipt.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name</label>
                  <input 
                    {...register('donorName', { required: 'Name is required' })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Your Full Name"
                  />
                  {errors.donorName && <p className="text-red-500 text-xs mt-1">{errors.donorName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input 
                    {...register('contactPhone', { required: 'Phone is required' })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="For receipt delivery (WhatsApp preferred)"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                    <input 
                      type="number"
                      {...register('amount', { required: 'Amount is required', min: 1 })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g. 5000"
                    />
                    {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method Used</label>
                    <select 
                      {...register('method')}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="easypaisa">Easypaisa</option>
                      <option value="cash">Cash (Handed to Member)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donation Purpose</label>
                  <select 
                    {...register('purpose')}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="community-fund">General Community Fund</option>
                    <option value="emergency">Emergency Relief Fund</option>
                    <option value="specific-project">Specific Project (Contact Admin)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Donation Record'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
