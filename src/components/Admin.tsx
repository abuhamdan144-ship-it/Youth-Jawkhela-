import React, { useEffect, useState } from 'react';
import { getRedirectResult, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider, db, storage } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Users, CreditCard, LayoutDashboard, Settings, LogOut, CheckCircle, XCircle, Printer, Droplet, Briefcase, FileText, Newspaper, Menu, Globe2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Simplified for MVP. We check if the logged in email is the admin.
const ADMIN_EMAILS = ['abuhamdan144@gmail.com', 'hiapp144@gmail.com', 'admin@zwanan-jawkhel.com'].map((email) => email.trim().toLowerCase());

// Firestore rejects undefined values. Build write objects explicitly and remove only undefined fields.
function withoutUndefined<T extends Record<string, any>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)) as T;
}


const AdminItemActions = ({ 
  collectionName, 
  item, 
  onRefresh, 
  titleField,
  onApprove,
  onReject,
  onDelete,
  onSave,
  extraButtons
}: { 
  collectionName: string, 
  item: any, 
  onRefresh: () => void, 
  titleField: string,
  onApprove?: () => void,
  onReject?: () => void,
  onDelete?: () => void,
  onSave?: () => void,
  extraButtons?: React.ReactNode
}) => {
  const handleApprove = onApprove || (async () => {
    try { await updateDoc(doc(db, collectionName, item.id), { status: 'Approved' }); alert('Approved!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleReject = onReject || (async () => {
    try { await updateDoc(doc(db, collectionName, item.id), { status: 'Rejected' }); alert('Rejected!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleDelete = onDelete || (async () => {
    if(!confirm('Delete this item?')) return;
    try { await deleteDoc(doc(db, collectionName, item.id)); alert('Deleted!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleSave = onSave || (async () => {
    const newValue = prompt(`Edit ${titleField} (Save action):`, item[titleField] || '');
    if (newValue === null) return;
    try { 
      await updateDoc(doc(db, collectionName, item.id), { [titleField]: newValue }); 
      alert('Saved!'); 
      onRefresh(); 
    } catch (e:any) { 
      alert(e.message); 
    }
  });

  const isRequestCollection = ['memberships', 'overseasRegistration', 'bloodDonation'].includes(collectionName);
  const currentStatus = item.status || 'Pending';
  
  return (
    <div className="flex flex-col gap-2">
      {isRequestCollection && <div className={`text-xs font-bold px-2 py-1 rounded w-max ${currentStatus === 'Approved' ? 'bg-green-100 text-green-800' : currentStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>Status: {currentStatus}</div>}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={handleSave} className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Save</button>
        {(isRequestCollection && currentStatus !== 'Approved') && <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>}
        {(isRequestCollection && currentStatus !== 'Rejected') && <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>}
        <button onClick={handleDelete} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
        {extraButtons}
      </div>
    </div>
  )
}

export function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  
  // Phase 2 states
  const [bloodFilter, setBloodFilter] = useState('');
  const [cabinetMembers, setCabinetMembers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [overseas, setOverseas] = useState<any[]>([]);
  
  // Form states
  const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'President', startDate: '', endDate: '', responsibilities: '' });
  const [cabinetImage, setCabinetImage] = useState<File | null>(null);
  const [newMeetingForm, setNewMeetingForm] = useState({ date: '', location: '', summary: '' });
  const [newNewsForm, setNewNewsForm] = useState({ title: '', category: 'Announcement', date: '', content: '' });
  const [newEventForm, setNewEventForm] = useState({ title: '', type: 'General', date: '', time: '', location: '', description: '' });
  const [newAdForm, setNewAdForm] = useState({ title: '', businessName: '', cta: '', description: '', imageUrl: '', durationDays: '30' });
  const [adImage, setAdImage] = useState<File | null>(null);

  const [newMemberForm, setNewMemberForm] = useState({ fullName: '', phone: '', cnic: '', bloodGroup: 'O+', village: 'Jawkhela' });
  const [newDonationForm, setNewDonationForm] = useState({ donorName: '', amount: '', date: '', purpose: '' });
  const [newBloodForm, setNewBloodForm] = useState({ patientName: '', bloodGroup: 'A+', hospital: '', contactNumber: '', urgency: 'High' });
  const [newOverseasForm, setNewOverseasForm] = useState({ fullName: '', currentCountry: '', currentCity: '', phone: '', homeVillage: '' });
  const [donations, setDonations] = useState<any[]>([]);


  useEffect(() => {
    getRedirectResult(auth).catch((error) => setLoginError(`Google login failed: ${error?.code || 'try again'}`));
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      const normalizedEmail = currentUser?.email?.trim().toLowerCase() || '';
      const isOwnerEmail = ADMIN_EMAILS.includes(normalizedEmail);
      setAuthorized(Boolean(currentUser && isOwnerEmail));
      if (currentUser && isOwnerEmail) {
        fetchMembers();
        fetchCabinet();
        fetchMeetings();
        fetchNewsAndEvents();
        fetchAdsAndBlood();
        fetchDonations();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAdsAndBlood = async () => {
    try {
      const bq = query(collection(db, 'bloodDonation'), orderBy('createdAt', 'desc'));
      const bs = await getDocs(bq);
      const bl: any[] = [];
      bs.forEach(d => bl.push({id: d.id, ...d.data()}));
      setBloodRequests(bl);

      const aq = query(collection(db, 'paidAds'), orderBy('createdAt', 'desc'));
      const as = await getDocs(aq);
      const al: any[] = [];
      as.forEach(d => al.push({id: d.id, ...d.data()}));
      setAds(al);

      const oq = query(collection(db, 'overseasRegistration'), orderBy('createdAt', 'desc'));
      const os = await getDocs(oq);
      const ol: any[] = [];
      os.forEach(d => ol.push({id: d.id, ...d.data()}));
      setOverseas(ol);
    } catch(err) {
      console.error(err);
    }
  };

  const fetchNewsAndEvents = async () => {
    try {
      const nq = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const ns = await getDocs(nq);
      const nl: any[] = [];
      ns.forEach(d => nl.push({id: d.id, ...d.data()}));
      setNews(nl);

      const eq = query(collection(db, 'events'), orderBy('date', 'desc'));
      const es = await getDocs(eq);
      const el: any[] = [];
      es.forEach(d => el.push({id: d.id, ...d.data()}));
      setEvents(el);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMembers = async () => {
    setFetching(true);
    try {
      const qPending = query(collection(db, 'memberships'), where('status', '==', 'Pending'));
      const pendingSnapshot = await getDocs(qPending);
      const pendingList: any[] = [];
      pendingSnapshot.forEach((d) => pendingList.push({ id: d.id, ...d.data() }));
      setPendingMembers(pendingList);

      const qActive = query(collection(db, 'memberships'), where('status', '==', 'Approved'));
      const activeSnapshot = await getDocs(qActive);
      const activeList: any[] = [];
      activeSnapshot.forEach((d) => activeList.push({ id: d.id, ...d.data() }));
      setActiveMembers(activeList);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchCabinet = async () => {
    try {
      const cabSnapshot = await getDocs(collection(db, 'cabinet'));
      const cabList: any[] = [];
      cabSnapshot.forEach((d) => cabList.push({ id: d.id, ...d.data() }));
      setCabinetMembers(cabList);
    } catch (error) {
      console.error("Error fetching cabinet:", error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const meetQuery = query(collection(db, 'cabinetMeetings'), orderBy('date', 'desc'));
      const meetSnapshot = await getDocs(meetQuery);
      const meetList: any[] = [];
      meetSnapshot.forEach((d) => meetList.push({ id: d.id, ...d.data() }));
      setMeetings(meetList);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleLogin = async () => {
    setLoginError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      if (code.includes('popup-blocked') || code.includes('popup-closed')) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        setLoginError(`Google login failed (${code || 'unknown error'}). Make sure the owner Google email is authorized in Firebase.`);
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setLoginError('Login failed. Check your admin email and password, then try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const approveMember = async (id: string) => {
    try {
      const memberRef = doc(db, 'memberships', id);
      await updateDoc(memberRef, {
        status: 'Approved',
        cardNumber: `ZJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        issueDate: serverTimestamp()
      });
      fetchMembers();
      alert("Member approved successfully!");
    } catch (error) {
      console.error("Error approving member:", error);
      alert("Failed to approve member.");
    }
  };

  const rejectMember = async (id: string) => {
    if(!confirm('Reject this member?')) return;
    try {
      const memberRef = doc(db, 'memberships', id);
      await updateDoc(memberRef, {
        status: 'Rejected'
      });
      fetchMembers();
      alert("Member rejected.");
    } catch (error) {
      console.error(error);
      alert("Error rejecting member.");
    }
  };

  const deleteMember = async (id: string) => {
    if(!confirm('Delete this member?')) return;
    try {
      await deleteDoc(doc(db, 'memberships', id));
      fetchMembers();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCabinetMember = async (id: string) => {
    if(!confirm('Delete cabinet member?')) return;
    try { await deleteDoc(doc(db, 'cabinet', id)); fetchCabinet(); } catch (e) { console.error(e); }
  };

  const editCabinetMember = async (member: any) => {
    const position = prompt('Position', member.position || 'General Member');
    if (!position) return;
    const responsibilities = prompt('Responsibilities / bio', member.responsibilities || '') ?? (member.responsibilities || '');
    try { await updateDoc(doc(db, 'cabinet', member.id), { position, responsibilities }); fetchCabinet(); } catch (e) { console.error(e); alert('Failed to update cabinet member.'); }
  };

  const editMember = async (member: any) => {
    const fullName = prompt('Member name', member.fullName || member.name || '');
    if (!fullName) return;
    const phone = prompt('Phone number', member.phone || '') ?? (member.phone || '');
    try { await updateDoc(doc(db, 'memberships', member.id), { fullName, name: fullName, phone }); fetchMembers(); } catch (e) { console.error(e); alert('Failed to update member.'); }
  };

  
  const fetchDonations = async () => {
    try {
      const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setDonations(list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'memberships'), withoutUndefined({
        ...newMemberForm,
        name: newMemberForm.fullName.trim(),
        status: 'Approved',
        membershipTier: 'standard',
        createdAt: serverTimestamp()
      }));
      setNewMemberForm({ fullName: '', phone: '', cnic: '', bloodGroup: 'O+', village: 'Jawkhela' });
      fetchMembers();
      alert('Member added manually.');
    } catch(e) { console.error(e); }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'donations'), withoutUndefined({
        donorName: newDonationForm.donorName.trim(),
        amount: Number(newDonationForm.amount),
        date: newDonationForm.date,
        purpose: newDonationForm.purpose.trim(),
        createdAt: serverTimestamp()
      }));
      setNewDonationForm({ donorName: '', amount: '', date: '', purpose: '' });
      fetchDonations();
      alert('Donation record saved.');
    } catch(e) { console.error(e); }
  };

  const handleAddBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'bloodDonation'), withoutUndefined({
        patientName: newBloodForm.patientName.trim(),
        bloodGroup: newBloodForm.bloodGroup,
        hospital: newBloodForm.hospital.trim(),
        contact: newBloodForm.contactNumber.trim(),
        urgency: newBloodForm.urgency,
        status: 'Active',
        createdAt: serverTimestamp()
      }));
      setNewBloodForm({ patientName: '', bloodGroup: 'A+', hospital: '', contactNumber: '', urgency: 'High' });
      fetchAdsAndBlood();
      alert('Blood request submitted.');
    } catch(e) { console.error(e); }
  };

  const handleAddOverseas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'overseasRegistration'), withoutUndefined({
        userId: user?.uid || '',
        fullName: newOverseasForm.fullName.trim(),
        currentCountry: newOverseasForm.currentCountry.trim(),
        currentCity: newOverseasForm.currentCity.trim(),
        phone: newOverseasForm.phone.trim(),
        homeVillage: newOverseasForm.homeVillage.trim(),
        status: 'Pending',
        createdAt: serverTimestamp()
      }));
      setNewOverseasForm({ fullName: '', currentCountry: '', currentCity: '', phone: '', homeVillage: '' });
      fetchAdsAndBlood();
      alert('Overseas record saved.');
    } catch(e) { console.error(e); }
  };

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = newAdForm.imageUrl;
      if (adImage) {
        const imageRef = ref(storage, `ads/${Date.now()}-${adImage.name}`);
        await uploadBytes(imageRef, adImage);
        finalImageUrl = await getDownloadURL(imageRef);
      }

      const durationDays = Number(newAdForm.durationDays);
      if (!Number.isInteger(durationDays) || durationDays < 1) {
        throw new Error('Duration must be a whole number of at least 1 day.');
      }
      await addDoc(collection(db, 'paidAds'), withoutUndefined({
        title: newAdForm.title.trim(),
        businessName: newAdForm.businessName.trim(),
        cta: newAdForm.cta.trim(),
        description: newAdForm.description.trim(),
        ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
        durationDays,
        expiresAt: new Date(Date.now() + durationDays * 86400000),
        createdAt: serverTimestamp()
      }));
      setNewAdForm({ title: '', businessName: '', cta: '', description: '', imageUrl: '', durationDays: '30' });
      setAdImage(null);
      fetchAdsAndBlood();
      alert('Ad added!');
    } catch (e) { console.error(e); }
  };

  const deleteAd = async (id: string) => {
    if(!confirm('Delete ad?')) return;
    try {
      await deleteDoc(doc(db, 'paidAds', id));
      fetchAdsAndBlood();
    } catch(e) { console.error(e); }
  };

  const deleteNews = async (id: string) => {
    if(!confirm('Delete announcement?')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      fetchNewsAndEvents();
    } catch(e) { console.error(e); }
  };

  const deleteEvent = async (id: string) => {
    if(!confirm('Delete event?')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      fetchNewsAndEvents();
    } catch(e) { console.error(e); }
  };

  const deleteOverseas = async (id: string) => {
    if(!confirm('Delete overseas registration?')) return;
    try {
      await deleteDoc(doc(db, 'overseasRegistration', id));
      fetchAdsAndBlood();
    } catch(e) { console.error(e); }
  };

  const deleteBloodRequest = async (id: string) => {
    if(!confirm('Delete blood request?')) return;
    try {
      await deleteDoc(doc(db, 'bloodDonation', id));
      fetchAdsAndBlood();
    } catch(e) { console.error(e); }
  };

  const generatePDFCard = async (member: any) => {
    const cardElement = document.createElement('div');
    const name = member.fullName || member.name || 'Community Member';
    const initials = name.split(' ').map((part: string) => part[0]).slice(0, 2).join('').toUpperCase();
    const expiry = member.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    cardElement.style.cssText = 'width:900px;height:568px;position:absolute;left:-9999px;color:white;padding:42px;background:linear-gradient(135deg,#075448,#0b806d 58%,#55c69c);font-family:Arial,sans-serif;border-radius:28px;overflow:hidden;box-sizing:border-box;';
    cardElement.innerHTML = `
      <div style="position:absolute;inset:-240px 35% 80% -25%;background:linear-gradient(125deg,transparent 34%,rgba(255,255,255,.16) 35%,rgba(255,255,255,.02) 52%,transparent 53%);transform:rotate(12deg)"></div>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:16px"><img src="/zj-logo-emerald.png" crossorigin="anonymous" style="width:58px;height:58px;object-fit:contain;border-radius:16px;background:white" /><div><div style="font-size:24px;font-weight:800">Zwanan Jawkhela</div><div style="font-size:12px;opacity:.75;margin-top:4px">YOUTH WELFARE COMMUNITY</div></div></div>
        <div style="font-size:12px;font-weight:800;letter-spacing:2px;color:#c8f5d9">✓ VERIFIED MEMBER</div>
      </div>
      <div style="position:relative;display:flex;align-items:center;gap:22px;margin-top:72px">
        <div style="width:116px;height:140px;border-radius:18px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:42px;font-weight:800">${member.profileImageUrl ? `<img src="${member.profileImageUrl}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover" />` : initials}</div>
        <div style="flex:1"><div style="font-size:11px;letter-spacing:2px;opacity:.7">OFFICIAL MEMBER</div><div style="font-size:36px;font-weight:800;margin:12px 0 8px">${name}</div><div style="font-size:18px;color:#f5c873;font-weight:700;letter-spacing:1px">${member.cardNumber || member.membershipNumber || 'ZJ-2026-000'}</div></div>
        <div style="width:82px;height:82px;border:3px solid rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;letter-spacing:2px">SCAN</div>
      </div>
      <div style="position:relative;display:flex;gap:48px;border-top:1px solid rgba(255,255,255,.25);border-bottom:1px solid rgba(255,255,255,.25);margin-top:46px;padding:18px 0"><div><small style="display:block;font-size:10px;letter-spacing:1px;opacity:.65">BLOOD GROUP</small><b style="font-size:17px">${member.bloodGroup || member.bloodType || '—'}</b></div><div><small style="display:block;font-size:10px;letter-spacing:1px;opacity:.65">VILLAGE</small><b style="font-size:17px">${member.village || 'Jawkhela'}</b></div><div><small style="display:block;font-size:10px;letter-spacing:1px;opacity:.65">VALID THROUGH</small><b style="font-size:17px">${expiry}</b></div></div>
      <div style="position:relative;display:flex;justify-content:space-between;margin-top:22px;font-size:11px;opacity:.75"><span>Jawkhela, Pakistan</span><span>Community service card</span></div>`;
    document.body.appendChild(cardElement);
    try {
      const canvas = await html2canvas(cardElement, { scale: 2, useCORS: true, backgroundColor: null });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [900, 568] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 900, 568);
      pdf.save(`ZJ_Emerald_Card_${name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) { console.error('Error generating PDF card:', error); alert('Failed to generate PDF card.'); }
    finally { document.body.removeChild(cardElement); }
  };

  const initiateWhatsApp = (phone: string, name: string) => {
    // Very basic integration using click-to-chat
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Assalamu Alaikum ${name},\n\nWelcome to Zwanan Jawkhela! Your membership has been approved.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleAddCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newCabinetForm.name.trim()) return alert("Please enter a name");
      let profileImage = '';
      if (cabinetImage) {
        const imageRef = ref(storage, `cabinet/${Date.now()}-${cabinetImage.name}`);
        await uploadBytes(imageRef, cabinetImage);
        profileImage = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, 'cabinet'), withoutUndefined({
        userId: user?.uid || '',
        name: newCabinetForm.name.trim(),
        profileImage,
        position: newCabinetForm.position,
        startDate: newCabinetForm.startDate,
        endDate: newCabinetForm.endDate,
        tenure: { startDate: newCabinetForm.startDate, endDate: newCabinetForm.endDate },
        responsibilities: newCabinetForm.responsibilities.trim(),
        status: 'Active',
        createdAt: serverTimestamp()
      }));
      alert('Cabinet member added');
      setNewCabinetForm({ name: '', position: 'President', startDate: '', endDate: '', responsibilities: '' });
      setCabinetImage(null);
      fetchCabinet();
    } catch (error: any) {
      console.error(error);
      alert(`Failed to save: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'cabinetMeetings'), withoutUndefined({
        date: newMeetingForm.date,
        agenda: newMeetingForm.summary.trim(),
        minutes: newMeetingForm.summary.trim(),
        summary: newMeetingForm.summary.trim(),
        decisions: [],
        attendees: [],
        location: newMeetingForm.location.trim(),
        createdAt: serverTimestamp()
      }));
      alert('Meeting recorded');
      setNewMeetingForm({ date: '', location: '', summary: '' });
      fetchMeetings();
    } catch (error) {
      console.error(error);
      alert('Failed to record meeting');
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'announcements'), withoutUndefined({
        title: newNewsForm.title.trim(),
        category: newNewsForm.category,
        date: newNewsForm.date,
        content: newNewsForm.content.trim(),
        createdAt: serverTimestamp()
      }));
      alert('News published');
      setNewNewsForm({ title: '', category: 'Announcement', date: '', content: '' });
      fetchNewsAndEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to publish news');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'events'), withoutUndefined({
        title: newEventForm.title.trim(),
        type: newEventForm.type,
        date: newEventForm.date,
        time: newEventForm.time,
        location: newEventForm.location.trim(),
        description: newEventForm.description.trim(),
        createdAt: serverTimestamp()
      }));
      alert('Event scheduled');
      setNewEventForm({ title: '', type: 'General', date: '', time: '', location: '', description: '' });
      fetchNewsAndEvents();
    } catch (error) {
      console.error(error);
      alert('Failed to schedule event');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div>
            <div className="w-16 h-16 bg-accent rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
              ZJ
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Admin Portal</h2>
            <p className="mt-2 text-sm text-gray-600">
              Restricted access. Authorized personnel only.
            </p>
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500" />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-white bg-primary hover:bg-green-600 transition-colors">Sign in to admin</button>
          </form>
          <div className="flex items-center gap-3 text-xs text-gray-400"><span className="h-px bg-gray-200 flex-1" />or<span className="h-px bg-gray-200 flex-1" /></div>
          <button onClick={handleLogin} className="w-full flex justify-center py-3 px-4 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">Sign in with Google</button>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow border border-red-200 text-center max-w-md">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Your email ({user.email}) is not authorized to access the admin dashboard.</p>
          <button onClick={handleLogout} className="bg-gray-900 text-white px-4 py-2 rounded-lg">Sign Out</button>
        </div>
      </div>
    );
  }

  const selectTab = (tab: string) => { setActiveTab(tab); setSidebarOpen(false); };
  return (
    <div className="flex min-h-screen min-w-0 bg-gray-100">
      {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black/40 lg:hidden" />}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-accent text-white shadow-xl flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-secondary">Admin Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => selectTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => selectTab('members')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'members' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Users size={20} /> Membership
            {pendingMembers.length > 0 && (
              <span className="ml-auto bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingMembers.length}</span>
            )}
          </button>
          <button 
            onClick={() => selectTab('donations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'donations' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <CreditCard size={20} /> Donations
          </button>
          <button 
            onClick={() => selectTab('blood')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'blood' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Droplet size={20} /> Blood Database
          </button>
          <button 
            onClick={() => selectTab('overseas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'overseas' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Globe2 size={20} /> Overseas
          </button>
          <button 
            onClick={() => selectTab('cabinet')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'cabinet' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Briefcase size={20} /> Cabinet Members
          </button>
          <button 
            onClick={() => selectTab('meetings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'meetings' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <FileText size={20} /> Meetings
          </button>
          <button 
            onClick={() => selectTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'news' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <Newspaper size={20} /> Announcements
          </button>
          <button 
            onClick={() => selectTab('ads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'ads' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <CheckCircle size={20} /> Paid Ads
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Menu size={22} /></button><h1 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1></div>
        </header>
        
        <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-2">Pending Approvals</span>
                <span className="text-4xl font-bold text-gray-900">{pendingMembers.length}</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-2">Active Members</span>
                <span className="text-4xl font-bold text-gray-900">{activeMembers.length}</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-2">Recent Donations</span>
                <span className="text-4xl font-bold text-gray-900">--</span>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-2">Overseas Pakistanis</span>
                <span className="text-4xl font-bold text-gray-900">{overseas.length}</span>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Member Manually</h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required value={newMemberForm.fullName} onChange={e => setNewMemberForm({...newMemberForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.phone} onChange={e => setNewMemberForm({...newMemberForm, phone: e.target.value})} placeholder="Phone" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.cnic} onChange={e => setNewMemberForm({...newMemberForm, cnic: e.target.value})} placeholder="CNIC" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md">Save Member</button>
                </form>
              </div>
              {/* Pending Members */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Pending Memberships</h3>
                  <button onClick={fetchMembers} className="text-sm text-green-600 hover:text-green-700 font-medium">
                    {fetching ? 'Refreshing...' : 'Refresh List'}
                  </button>
                </div>
                
                {pendingMembers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No pending membership applications.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">CNIC / Phone</th>
                          <th className="p-4 font-medium">Type</th>
                          <th className="p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {pendingMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{member.fullName || member.name}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm font-mono text-gray-700">{member.cnic}</div>
                              <div className="text-sm text-gray-500">{member.phone}</div>
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                {member.bloodGroup || member.membershipTier}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2">
                              <AdminItemActions 
                                collectionName="memberships" 
                                item={member} 
                                onRefresh={fetchMembers} 
                                titleField="fullName" 
                                onApprove={() => approveMember(member.id)}
                                onReject={() => rejectMember(member.id)}
                                onDelete={() => deleteMember(member.id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Active Members */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Active Members Directory</h3>
                </div>
                
                {activeMembers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No active members yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                          <th className="p-4 font-medium">Name & Member No.</th>
                          <th className="p-4 font-medium">Contact</th>
                          <th className="p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{member.fullName || member.name}</div>
                              <div className="text-sm font-mono text-secondary font-semibold">{member.cardNumber || member.membershipNumber}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-700">{member.phone}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => generatePDFCard(member)}
                                  className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                >
                                  <Printer size={16} /> Card
                                </button>
                                <button 
                                  onClick={() => initiateWhatsApp(member.phone, member.fullName || member.name)}
                                  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                >
                                  WhatsApp
                                </button>
                                <AdminItemActions 
                                  collectionName="memberships" 
                                  item={member} 
                                  onRefresh={fetchMembers} 
                                  titleField="fullName" 
                                  onSave={() => editMember(member)} 
                                  onDelete={() => deleteMember(member.id)} 
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Donation</h3>
                <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input required value={newDonationForm.donorName} onChange={e => setNewDonationForm({...newDonationForm, donorName: e.target.value})} placeholder="Donor Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newDonationForm.amount} onChange={e => setNewDonationForm({...newDonationForm, amount: e.target.value})} placeholder="Amount (e.g. 5000 PKR)" className="border rounded-lg px-4 py-2" />
                  <input required type="date" value={newDonationForm.date} onChange={e => setNewDonationForm({...newDonationForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required value={newDonationForm.purpose} onChange={e => setNewDonationForm({...newDonationForm, purpose: e.target.value})} placeholder="Purpose" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md">Save Donation</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donations</h3>
                <div className="space-y-3">
                  {donations.length === 0 ? <p className="text-gray-500">No donations recorded yet.</p> : donations.map(d => (
                    <div key={d.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div><b className="block">{d.donorName}</b><span className="text-sm text-gray-500">{d.purpose} · {d.date}</span></div>
                      <div>
                        <span className="font-bold text-green-600 block text-right mb-2">{d.amount}</span>
                        <AdminItemActions collectionName="donations" item={d} onRefresh={fetchDonations} titleField="donorName" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {activeTab === 'blood' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Blood Request</h3>
                <form onSubmit={handleAddBloodRequest} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <input required value={newBloodForm.patientName} onChange={e => setNewBloodForm({...newBloodForm, patientName: e.target.value})} placeholder="Patient Name" className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <select value={newBloodForm.bloodGroup} onChange={e => setNewBloodForm({...newBloodForm, bloodGroup: e.target.value})} className="border rounded-lg px-4 py-2">
                    <option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                    <option value="A-">A-</option><option value="O-">O-</option><option value="B-">B-</option><option value="AB-">AB-</option>
                  </select>
                  <input required value={newBloodForm.hospital} onChange={e => setNewBloodForm({...newBloodForm, hospital: e.target.value})} placeholder="Hospital/City" className="border rounded-lg px-4 py-2" />
                  <input required value={newBloodForm.contactNumber} onChange={e => setNewBloodForm({...newBloodForm, contactNumber: e.target.value})} placeholder="Contact #" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md">Add Request</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Droplet className="text-red-500" /> Emergency Blood Database</h3>
                  <p className="text-sm text-gray-500 mt-1">Access restricted to active members only.</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={bloodFilter} 
                    onChange={(e) => setBloodFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Blood Types</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                  <button 
                    onClick={() => {
                      const filteredNumbers = activeMembers.filter(m => bloodFilter ? m.bloodType === bloodFilter : true).map(m => m.phone).join(', ');
                      if(filteredNumbers) {
                        navigator.clipboard.writeText(filteredNumbers);
                        alert('Phone numbers copied to clipboard for WhatsApp Broadcast!');
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Copy Broadcast List
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                        <th className="p-4 font-medium">Donor Name</th>
                        <th className="p-4 font-medium">Blood Group</th>
                        <th className="p-4 font-medium">Contact</th>
                        <th className="p-4 font-medium">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeMembers.filter(m => bloodFilter ? (m.bloodGroup === bloodFilter || m.bloodType === bloodFilter) : true).map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{member.fullName || member.name}</td>
                          <td className="p-4"><span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">{member.bloodGroup || member.bloodType}</span></td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900">{member.phone}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 truncate max-w-xs">{member.village || member.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Emergency Requests</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                        <th className="p-4 font-medium">Patient / Requester</th>
                        <th className="p-4 font-medium">Blood Group</th>
                        <th className="p-4 font-medium">Hospital & Contact</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bloodRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{req.patientName || req.name}</td>
                          <td className="p-4"><span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">{req.bloodGroup}</span></td>
                          <td className="p-4">
                            <div className="text-sm text-gray-900">{req.hospital}</div>
                            <div className="text-sm text-gray-500">{req.contact}</div>
                          </td>
                          <td className="p-4">
                              <AdminItemActions collectionName="bloodDonation" item={req} onRefresh={fetchAdsAndBlood} titleField="patientName" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'overseas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Overseas Member</h3>
                <form onSubmit={handleAddOverseas} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input required value={newOverseasForm.fullName} onChange={e => setNewOverseasForm({...newOverseasForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCountry} onChange={e => setNewOverseasForm({...newOverseasForm, currentCountry: e.target.value})} placeholder="Country" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCity} onChange={e => setNewOverseasForm({...newOverseasForm, currentCity: e.target.value})} placeholder="City" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.phone} onChange={e => setNewOverseasForm({...newOverseasForm, phone: e.target.value})} placeholder="Phone" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-md">Add Member</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Overseas Registrations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                        <th className="p-4 font-medium">Name & CNIC/Passport</th>
                        <th className="p-4 font-medium">Country & City</th>
                        <th className="p-4 font-medium">Village & Contact</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {overseas.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{reg['Full name'] || reg.name}</div>
                            <div className="text-sm font-mono text-gray-500">{reg['Passport / CNIC']}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-900">{reg['Current country']}</div>
                            <div className="text-sm text-gray-500">{reg['Current city']}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-900">{reg['Home village']}</div>
                            <div className="text-sm text-gray-500">{reg['Phone']}</div>
                          </td>
                          <td className="p-4">
                            <AdminItemActions collectionName="overseasRegistration" item={reg} onRefresh={fetchAdsAndBlood} titleField="Full name" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cabinet' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign Cabinet Member</h3>
                <form onSubmit={handleAddCabinet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabinet Member Name</label>
                    <input required type="text" placeholder="Full Name" value={newCabinetForm.name} onChange={(e) => setNewCabinetForm({...newCabinetForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <select required value={newCabinetForm.position} onChange={(e) => setNewCabinetForm({...newCabinetForm, position: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="General Secretary">General Secretary</option>
                      <option value="Finance Secretary">Finance Secretary</option>
                      <option value="Water & Electricity Secretary">Water & Electricity Secretary</option>
                      <option value="Cleaning Secretary">Cleaning Secretary</option>
                      <option value="Education Secretary">Education Secretary</option>
                      <option value="Health Secretary">Health Secretary</option>
                      <option value="Social Media / IT Secretary">Social Media / IT Secretary</option>
                      <option value="Culture Secretary">Culture Secretary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" required value={newCabinetForm.startDate} onChange={(e) => setNewCabinetForm({...newCabinetForm, startDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" required value={newCabinetForm.endDate} onChange={(e) => setNewCabinetForm({...newCabinetForm, endDate: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabinet member image</label>
                    <input type="file" accept="image/*" onChange={(e) => setCabinetImage(e.target.files?.[0] || null)} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                    <p className="text-xs text-gray-500 mt-1">Optional JPG or PNG. The image will appear on the cabinet page and homepage.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities / Bio</label>
                    <textarea value={newCabinetForm.responsibilities} onChange={(e) => setNewCabinetForm({...newCabinetForm, responsibilities: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" rows={2}></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors">Submit Cabinet Member</button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-800">Current Cabinet</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Position</th>
                        <th className="p-4 font-medium">Term</th><th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cabinetMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{member.name}</td>
                          <td className="p-4 text-sm text-gray-700 font-semibold">{member.position}</td>
                          <td className="p-4 text-sm text-gray-500">{new Date(member.startDate || member.tenure?.startDate).toLocaleDateString()} - {new Date(member.endDate || member.tenure?.endDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <AdminItemActions 
                              collectionName="cabinet" 
                              item={member} 
                              onRefresh={fetchCabinet} 
                              titleField="name" 
                              onSave={() => editCabinetMember(member)}
                              onDelete={() => deleteCabinetMember(member.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Meeting</h3>
                <form onSubmit={handleAddMeeting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" required value={newMeetingForm.date} onChange={(e) => setNewMeetingForm({...newMeetingForm, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Mode</label>
                    <input type="text" required placeholder="e.g. Community Center or Zoom" value={newMeetingForm.location} onChange={(e) => setNewMeetingForm({...newMeetingForm, location: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Summary</label>
                    <textarea required placeholder="Key points discussed..." value={newMeetingForm.summary} onChange={(e) => setNewMeetingForm({...newMeetingForm, summary: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 min-h-[100px]"></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Save Meeting Record</button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-semibold text-gray-800">Meeting Archive</h3></div>
                <div className="divide-y divide-gray-100">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{new Date(meeting.date).toLocaleDateString()} &mdash; {meeting.location}</h4>
                      </div>
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">{meeting.summary}</p>
                      <AdminItemActions collectionName="cabinetMeetings" item={meeting} onRefresh={fetchMeetings} titleField="summary" />
                    </div>
                  ))}
                  {meetings.length === 0 && <div className="p-6 text-gray-500 text-center">No meeting records found.</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* News Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Publish Announcement (Shows in Top Bar)</h3>
                  <form onSubmit={handleAddNews} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" required value={newNewsForm.title} onChange={(e) => setNewNewsForm({...newNewsForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select required value={newNewsForm.category} onChange={(e) => setNewNewsForm({...newNewsForm, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
                          <option value="Announcement">Announcement</option>
                          <option value="News">News</option>
                          <option value="Update">Update</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Takaar">Takaar (Community Notice)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" required value={newNewsForm.date} onChange={(e) => setNewNewsForm({...newNewsForm, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea required value={newNewsForm.content} onChange={(e) => setNewNewsForm({...newNewsForm, content: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 min-h-[100px]"></textarea>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button type="submit" className="w-full bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Publish News</button>
                    </div>
                  </form>
                </div>
                {/* News List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage News</h3>
                  <div className="space-y-3">
                    {news.map(n => (
                      <div key={n.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-bold text-sm">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.category}</p>
                        </div>
                        <AdminItemActions collectionName="announcements" item={n} onRefresh={fetchNewsAndEvents} titleField="title" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                {/* Event Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Event</h3>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                      <input type="text" required value={newEventForm.title} onChange={(e) => setNewEventForm({...newEventForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" required value={newEventForm.date} onChange={(e) => setNewEventForm({...newEventForm, date: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" required value={newEventForm.time} onChange={(e) => setNewEventForm({...newEventForm, time: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input type="text" required value={newEventForm.location} onChange={(e) => setNewEventForm({...newEventForm, location: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea required value={newEventForm.description} onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" rows={2}></textarea>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button type="submit" className="w-full bg-secondary hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Schedule Event</button>
                    </div>
                  </form>
                </div>
                {/* Events List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Manage Events</h3>
                  <div className="space-y-3">
                    {events.map(ev => (
                      <div key={ev.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                        <div>
                          <p className="font-bold text-sm">{ev.title}</p>
                          <p className="text-xs text-gray-500">{ev.date} {ev.time}</p>
                        </div>
                        <AdminItemActions collectionName="events" item={ev} onRefresh={fetchNewsAndEvents} titleField="title" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Paid Ad</h3>
                <form onSubmit={handleAddAd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title</label>
                    <input required value={newAdForm.title} onChange={e => setNewAdForm({...newAdForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input required value={newAdForm.businessName} onChange={e => setNewAdForm({...newAdForm, businessName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                    <input required value={newAdForm.cta} onChange={e => setNewAdForm({...newAdForm, cta: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required value={newAdForm.description} onChange={e => setNewAdForm({...newAdForm, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                    <input required type="number" min="1" value={newAdForm.durationDays} onChange={e => setNewAdForm({...newAdForm, durationDays: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAdImage(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setNewAdForm({...newAdForm, imageUrl: reader.result as string});
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                    />
                    {newAdForm.imageUrl && <img src={newAdForm.imageUrl} className="mt-2 h-20 rounded object-cover" alt="Ad preview" />}
                  </div>
                  <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors mt-2">Publish Ad</button>
                </form>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-h-[600px] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Ads</h3>
                <div className="space-y-4">
                  {ads.map(ad => (
                    <div key={ad.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{ad.title}</h4>
                        <p className="text-sm text-gray-500">{ad.businessName}</p>
                      </div>
                      <AdminItemActions collectionName="paidAds" item={ad} onRefresh={fetchAdsAndBlood} titleField="title" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
