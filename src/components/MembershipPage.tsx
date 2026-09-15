import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Upload, Download, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

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

  const cardMember = memberData || { ...form, profileImageUrl: profileImage, cardNumber: `ZJ-${new Date().getFullYear()}-0001` };
  const downloadCard = async () => {
    const frontElement = document.getElementById('membership-card-preview-front');
    const backElement = document.getElementById('membership-card-preview-back');
    if (!frontElement || !backElement) return;
    if (document.fonts?.ready) await document.fonts.ready;
    const waitForImages = async (element: HTMLElement) => {
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(images.map(async (image) => {
        image.crossOrigin = 'anonymous';
        if (image.complete && image.naturalWidth > 0) {
          try { await image.decode(); } catch { /* already decoded by the browser */ }
          return;
        }
        await new Promise<void>((resolve) => {
          const finish = () => { image.removeEventListener('load', finish); image.removeEventListener('error', finish); resolve(); };
          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
          window.setTimeout(finish, 5000);
        });
      }));
    };
    await Promise.all([waitForImages(frontElement), waitForImages(backElement)]);
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve(undefined)));
    const [frontCanvas, backCanvas] = await Promise.all([
      html2canvas(frontElement, { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false }),
      html2canvas(backElement, { scale: 3, useCORS: true, backgroundColor: '#ffffff', logging: false })
    ]);
    const width = frontCanvas.width;
    const height = frontCanvas.height;
    const pdf = new jsPDF({ orientation: width >= height ? 'landscape' : 'portrait', unit: 'px', format: [width, height] });
    pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, width, height, undefined, 'FAST');
    pdf.addPage([width, height], width >= height ? 'landscape' : 'portrait');
    pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, width, height, undefined, 'FAST');
    pdf.save(`ZJ_Membership_${cardMember.fullName || 'Preview'}.pdf`);
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
                    <input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Father's Name</label>
                    <input required value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CNIC</label>
                    <input required value={form.cnic} onChange={e => setForm({...form, cnic: e.target.value})} placeholder="XXXXX-XXXXXXX-X" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address / Village</label>
                  <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold mb-2" />
                  <input required value={form.village} onChange={e => setForm({...form, village: e.target.value})} placeholder="Village name" className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                    <input type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Blood Group</label>
                    <select value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold">
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
          {/* Live membership card preview */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-900">Membership Card Preview</h2><span className="text-xs font-bold text-green-700">LIVE</span></div>
            <div id="membership-card-preview-front" className={`membership-card-reference ${cardSide === 'back' ? 'membership-card-side-hidden' : ''}`}>
              <div className="reference-card__green-cut" />
              <div className="reference-card__gold-cut" />
              <div className="reference-card__head"><div className="reference-card__identity"><img crossOrigin="anonymous" src="/zwanan-jawkhela-seal.jpeg" alt="Zwanan Jawkhela seal" /><div><strong>Zwanan Jawkhela</strong><small>Youth Welfare Community</small></div></div><b dir="rtl">زوانان جوخیله تنظیم</b></div>
              <div className="reference-card__main"><div className="reference-card__photo">{cardMember.profileImageUrl ? <img crossOrigin="anonymous" src={cardMember.profileImageUrl} alt="Member" /> : <span>{(cardMember.fullName || 'YN').split(/\s+/).map((x: string) => x[0]).slice(0,2).join('').toUpperCase()}</span>}</div><div className="reference-card__details"><div className="reference-card__brand">JAWKHELA <em>COMMUNITY</em></div><div className="reference-card__name">{cardMember.fullName || 'YOUR NAME'}</div><div className="reference-card__number">{cardMember.cardNumber || `ZJ-${new Date().getFullYear()}-0001`}</div><div className="reference-card__role">Community Member</div><div className="reference-card__meta"><span><small>FATHER'S NAME</small>{cardMember.fatherName || 'Not provided'}</span><span><small>VILLAGE</small>{cardMember.village || 'Jawkhela'}</span></div></div></div>
              <div className="reference-card__approval"><strong>{cardMember.status === 'Approved' ? 'APPROVED MEMBER' : 'MEMBERSHIP APPLICANT'}</strong><span>COMMUNITY SERVICE MEMBER</span></div>
            </div>
            <div id="membership-card-preview-back" className={`membership-card-reference membership-card-reference--back ${cardSide === 'front' ? 'membership-card-side-hidden' : ''}`}>
              <div className="reference-back__top">◆ &nbsp; STRONGER TOGETHER, BETTER TOMORROW &nbsp; ◆</div>
              <h3>— MEMBER BENEFITS —</h3>
              <div className="reference-back__benefits"><span>🤝<b>COMMUNITY<br/>NETWORKING</b></span><span>♥<b>SOCIAL<br/>SUPPORT</b></span><span>◆<b>EDUCATIONAL<br/>RESOURCES</b></span><span>◇<b>ADVOCACY &<br/>WELFARE</b></span></div>
              <div className="reference-back__contact"><div>🌐 jawkhela-youth.vercel.app<br/>✉ Zwanan Jawkhela Community<br/>📍 Jawkhela, Pakistan</div><div><b>Helpline Numbers:</b><br/>+92 300 123 4567<br/>+92 301 123 4567</div><div className="reference-back__qr">SCAN TO VERIFY</div></div>
              <div className="reference-back__footer">◆ &nbsp; UNITY • RESPECT • CULTURE • SERVICE &nbsp; ◆</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')} className="w-full border border-[#075c41] text-[#075c41] font-bold py-3 rounded-lg hover:bg-green-50 transition-colors">View {cardSide === 'front' ? 'Back' : 'Front'} Side</button><button onClick={downloadCard} className="w-full bg-[#075c41] text-white font-bold py-3 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"><Download size={18} /> Download 2-Sided PDF</button></div>
          </div>

          {/* Status Check */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Check Status & Download</h2>
            <form onSubmit={handleCheckStatus} className="flex gap-3 mb-4">
              <input required value={checkCnic} onChange={e => setCheckCnic(e.target.value)} placeholder="Enter CNIC" className="flex-1 px-4 py-2 border rounded-lg focus:border-green-500 outline-none text-black font-bold" />
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
