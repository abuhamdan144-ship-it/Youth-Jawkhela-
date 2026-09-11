import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Upload, FileText, Download, CheckCircle, ChevronLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';

export function MembershipPage() {
  const [form, setForm] = useState({
    fullName: '',
    fatherName: '',
    cnic: '',
    phone: '',
    address: '',
    village: '',
    age: '',
    bloodGroup: 'A+',
  });
  
  const [profileImage, setProfileImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Status check state
  const [checkCnic, setCheckCnic] = useState('');
  const [memberData, setMemberData] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'memberships'), {
        ...form,
        age: Number(form.age),
        profileImageUrl: profileImage,
        status: 'Pending',
        userId: form.cnic, // Using CNIC as unique identifier for this demo
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert('Failed to submit application.');
    }
    setLoading(false);
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberData(null);
    setStatusMessage('Checking...');
    try {
      const q = query(collection(db, 'memberships'), where('cnic', '==', checkCnic));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = { id: docSnap.id, ...docSnap.data() } as Record<string, any>;
        setMemberData(data);
        setStatusMessage(`Status: ${data.status || 'Pending'}`);
      } else {
        setStatusMessage('No membership found for this CNIC.');
      }
    } catch (error) {
      setStatusMessage('Error checking status.');
    }
  };

  const handleDownloadCard = async () => {
    if (!memberData || memberData.status !== 'Approved') return;
    
    const cardEl = document.getElementById('membership-card-preview');
    if (!cardEl) return;

    try {
      const canvas = await html2canvas(cardEl, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [600, 350] });
      pdf.addImage(imgData, 'PNG', 0, 0, 600, 350);
      pdf.save(`ZJ_Membership_${memberData.fullName}.pdf`);
    } catch (error) {
      console.error("PDF generation error", error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <main className="page">
      <div className="container page-head">
        <Link to="/" className="back-link"><ChevronLeft size={16} /> Back home</Link>
        <div className="eyebrow">Zwanan Jawkhela · Community services</div>
        <h1>Become a Member</h1>
        <p>Apply for membership or check your application status to download your card.</p>
      </div>

      <div className="container mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Apply Form */}
        <div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">New Application</h2>
            {success ? (
              <div className="text-center p-8 bg-green-50 rounded-xl">
                <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-600">Your membership request is pending admin approval. You can check your status later using your CNIC.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-green-700 font-bold hover:underline">Apply for another member</button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Father's Name</label>
                    <input required value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CNIC</label>
                    <input required value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value})} placeholder="XXXXX-XXXXXXX-X" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address / Village</label>
                  <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none mb-2" />
                  <input required value={form.village} onChange={e => setForm({...form, village: e.target.value})} placeholder="Village name" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                    <input type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                    <select value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none">
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Profile Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img-upload" />
                    <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile preview" className="w-24 h-24 object-cover rounded-full mb-3" />
                      ) : (
                        <Upload className="text-gray-400 mb-3" size={32} />
                      )}
                      <span className="text-sm text-green-700 font-bold">{profileImage ? 'Change Image' : 'Click to Upload Image'}</span>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Live Preview & Status Check */}
        <div className="space-y-8">
          {/* Card Preview (Uses form data if no memberData, otherwise uses memberData) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Card Preview</h2>
            <div className="overflow-x-auto pb-4">
              <div id="membership-card-preview" className="relative w-[600px] h-[350px] rounded-2xl overflow-hidden shadow-2xl flex" style={{ background: 'linear-gradient(135deg, #0b6e61 0%, #071f2a 100%)', color: 'white' }}>
                <div className="w-[180px] bg-black/20 p-6 flex flex-col items-center justify-center text-center border-r border-white/10">
                  <div className="w-24 h-24 bg-white/10 rounded-full overflow-hidden mb-4 border-4 border-white/20">
                    {(memberData?.profileImageUrl || profileImage) ? (
                      <img src={memberData?.profileImageUrl || profileImage} className="w-full h-full object-cover" alt="Profile" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 text-4xl">👤</div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{memberData?.bloodGroup || form.bloodGroup || 'O+'}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-green-300">Blood Group</span>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full -z-0"></div>
                  
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-[#f4ca73]">Zwanan Jawkhela</h2>
                      <p className="text-xs tracking-widest text-green-100 uppercase mt-1">Official Member</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-black text-xl">ZJ</div>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-6 mt-8">
                    <div>
                      <p className="text-[10px] text-green-300 uppercase tracking-widest mb-1">Name</p>
                      <p className="font-bold text-xl">{memberData?.fullName || form.fullName || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-green-300 uppercase tracking-widest mb-1">CNIC</p>
                      <p className="font-mono">{memberData?.cnic || form.cnic || '00000-0000000-0'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-green-300 uppercase tracking-widest mb-1">Card Number</p>
                      <p className="font-mono text-[#f4ca73]">{memberData?.cardNumber || 'PENDING'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-green-300 uppercase tracking-widest mb-1">Village</p>
                      <p className="font-medium">{memberData?.village || form.village || 'Location'}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-white/20 text-[9px] text-white/60">
                    If found, please return to Zwanan Jawkhela welfare administration.
                  </div>
                </div>
              </div>
            </div>
            
            {(memberData?.status === 'Approved') && (
              <button onClick={handleDownloadCard} className="mt-4 w-full bg-[#f4ca73] text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                <Download size={18} /> Download Card PDF
              </button>
            )}
          </div>

          {/* Status Check */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Check Status & Download</h2>
            <form onSubmit={handleCheckStatus} className="flex gap-3 mb-4">
              <input required value={checkCnic} onChange={e => setCheckCnic(e.target.value)} placeholder="Enter CNIC" className="flex-1 px-4 py-2 border rounded-lg focus:border-green-500 outline-none" />
              <button type="submit" className="bg-gray-900 text-white px-6 font-bold rounded-lg hover:bg-gray-800">Check</button>
            </form>
            {statusMessage && (
              <div className={`p-4 rounded-lg font-bold ${memberData?.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
