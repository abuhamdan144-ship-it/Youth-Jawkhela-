import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Admin } from './components/Admin';
import { Activity, ArrowRight, Bell, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Droplets, Globe2, HeartHandshake, Images, Landmark, Menu, Megaphone, ShieldCheck, Sparkles, Users, Vote, X } from 'lucide-react';
import './index.css';

import { MembershipPage } from './components/MembershipPage';
import { MembershipCardDemo } from './components/MembershipCard';
import { Cabinet } from './components/Cabinet';

type RecordItem = Record<string, any> & { id?: string };
const sections = [
  { key: 'membership', title: 'Membership', description: 'Join the community and access your member services.', icon: Users, path: '/membership', tone: 'mint' },
  { key: 'bloodDonation', title: 'Blood Donation', description: 'Connect urgent blood requests with caring donors.', icon: Droplets, path: '/blood-donation', tone: 'rose' },
  { key: 'announcements', title: 'Announcements & Takaar', description: 'Important notices and community updates.', icon: Megaphone, path: '/announcements', tone: 'amber' },
  { key: 'cabinet', title: 'Cabinet Members', description: 'Meet the elected leadership serving the community.', icon: Landmark, path: '/cabinet', tone: 'blue' },
  { key: 'cabinetMeetings', title: 'Cabinet Meeting Summaries', description: 'Transparent records of decisions and progress.', icon: CalendarDays, path: '/meetings', tone: 'violet' },
  { key: 'candidates', title: 'Elections & Voting System', description: 'Participate in the future of our organization.', icon: Vote, path: '/elections', tone: 'cyan' },
  { key: 'dailyTasks', title: 'Daily Tasks With Images', description: 'See the work happening every day on the ground.', icon: Images, path: '/daily-tasks', tone: 'orange' },
  { key: 'campaigns', title: 'Awareness Campaigns', description: 'Learn, share, and help build a stronger society.', icon: Sparkles, path: '/campaigns', tone: 'green' },
  { key: 'overseasRegistration', title: 'Overseas Pakistanis Registration', description: 'Stay connected wherever life takes you.', icon: Globe2, path: '/overseas-registration', tone: 'indigo' },
];
const fallbackOverseas = [
  { fullName: 'Global Supporter', currentCountry: 'United Kingdom' },
  { fullName: 'Community Member', currentCountry: 'UAE' },
  { fullName: 'Jawkhela Youth', currentCountry: 'Saudi Arabia' },
];
const fallbackCabinet = [
  { name: 'Community President', position: 'President', responsibilities: 'Guiding the organization with integrity and service.', profileImage: '' },
  { name: 'General Secretary', position: 'General Secretary', responsibilities: 'Coordinating programs, records, and community communication.', profileImage: '' },
  { name: 'Finance Secretary', position: 'Finance Secretary', responsibilities: 'Managing financial resources transparently.', profileImage: '' },
  { name: 'Social Media / IT Secretary', position: 'Social Media / IT Secretary', responsibilities: 'Managing online presence and communication.', profileImage: '' },
];

async function readCollection(name: string, sortField = 'createdAt') {
  try {
    const snap = await getDocs(query(collection(db, name), orderBy(sortField, 'desc'), limit(30)));
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    try {
      const snap = await getDocs(query(collection(db, name), limit(30)));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch { return []; }
  }
}
function formatDate(value: any) { const d = value?.toDate ? value.toDate() : new Date(value); return Number.isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
function text(item: RecordItem, ...keys: string[]) { for (const k of keys) if (item[k]) return typeof item[k] === 'object' ? (item[k].english || item[k].urdu || '') : String(item[k]); return ''; }

function App() { return <BrowserRouter><Routes><Route path="*" element={<Site />} /></Routes></BrowserRouter>; }

function Ticker() {
  const [items, setItems] = useState<RecordItem[]>([]);

  useEffect(() => {
    readCollection('announcements').then(setItems);
  }, []);

  if (!items.length) return null;

  const announcements = Array.from(new Set(items
    .map(item => text(item, 'title', 'message'))
    .map(value => value.replace(/\s+/g, ' ').trim())
    .filter(Boolean))).slice(0, 6);
  if (!announcements.length) return null;
  const trackText = announcements.join('  ✦  ');

  return <div className="takaar-bar" role="region" aria-label="Takaar announcements">
    <div className="takaar-label"><Megaphone size={14} /> <span>TAKAAR</span></div>
    <div className="takaar-viewport"><div className="takaar-track" dir="rtl"><span>{trackText}</span><span aria-hidden="true">{trackText}</span></div></div>
  </div>;
}

function Site() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="site-shell"><div className="sticky-group"><Ticker /><Header onMenu={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} /></div><Routes><Route path="/admin" element={<Admin />} /><Route path="/membership-card-demo" element={<MembershipCardDemo />} /><Route path="/" element={<Home />} /><Route path="/membership" element={<MembershipPage />} /><Route path="/blood-donation" element={<FormPage type="bloodDonation" />} /><Route path="/overseas-registration" element={<FormPage type="overseasRegistration" />} /><Route path="/cabinet" element={<Cabinet />} /><Route path="/:type" element={<CollectionPage />} /></Routes><Footer /></div>;
}
function Header({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) { return <header className="topbar"><div className="container nav-wrap"><Link to="/" className="brand"><span className="brand-mark"><img src="/zj-logo-emerald.png" alt="Zwanan Jawkhela logo" /></span><span><b>Zwanan Jawkhela</b><small>Youth welfare & community</small></span></Link><button className="menu-btn" onClick={onMenu} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button><nav className={menuOpen ? 'nav-links open' : 'nav-links'}><NavLink to="/" end>Home</NavLink><NavLink to="/cabinet">Leadership</NavLink><NavLink to="/announcements">Updates</NavLink><NavLink to="/admin" className="admin-link">Admin</NavLink><NavLink to="/membership" className="nav-cta">Join the community <ArrowRight size={16} /></NavLink></nav></div></header>; }
function Footer() { return <footer><div className="container footer-grid"><div><Link to="/" className="brand footer-brand"><span className="brand-mark"><img src="/zj-logo-emerald.png" alt="Zwanan Jawkhela logo" /></span><span><b>Zwanan Jawkhela</b><small>Serving with unity</small></span></Link><p className="footer-note">A community platform for connection, welfare, and positive action.</p></div><div><p className="footer-heading">Explore</p><Link to="/membership">Membership</Link><Link to="/blood-donation">Blood donation</Link><Link to="/campaigns">Campaigns</Link></div><div><p className="footer-heading">Stay connected</p><Link to="/overseas-registration">Overseas registration</Link><Link to="/elections">Elections & voting</Link><Link to="/announcements">Announcements</Link></div></div><div className="container footer-bottom">Preparing websites by <strong>SHAUKAT KHAN YOUSAF</strong><span>Pray request for his late father Yousaf Khan</span></div></footer>; }
function Home() {
  const [news, setNews] = useState<RecordItem[]>([]); const [overseas, setOverseas] = useState<RecordItem[]>([]); const [ads, setAds] = useState<RecordItem[]>([]); const [cabinet, setCabinet] = useState<RecordItem[]>([]); const [activeCabinet, setActiveCabinet] = useState(0); const [copiedAccount, setCopiedAccount] = useState('');
  const copyAccount = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); setCopiedAccount(label); setTimeout(() => setCopiedAccount(''), 1800); } catch { setCopiedAccount(''); } };
  useEffect(() => { readCollection('announcements').then(setNews); readCollection('overseasRegistration').then((x) => setOverseas(x.length ? x : fallbackOverseas)); readCollection('paidAds').then(setAds); readCollection('cabinet').then(setCabinet); }, []);
  const marquee = [...overseas, ...overseas];
  const cabinetMembers = cabinet.length ? cabinet : fallbackCabinet;
  const activeMember = cabinetMembers[activeCabinet % cabinetMembers.length];
  useEffect(() => { const timer = window.setInterval(() => setActiveCabinet((current) => (current + 1) % cabinetMembers.length), 5000); return () => window.clearInterval(timer); }, [cabinetMembers.length]);
  return <main><section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="pulse-dot" /> Community first · خدمت اور اتحاد</div><h1>Stronger together,<br /><em>brighter tomorrow.</em></h1><p>Welcome to the official digital home of Zwanan Jawkhela Youth Welfare. Connect, contribute, and help our community move forward.</p><div className="hero-actions"><Link to="/membership" className="button primary">Become a member <ArrowRight size={18} /></Link><Link to="/overseas-registration" className="button ghost">Overseas registration</Link></div><div className="trust-row"><span><ShieldCheck size={18} /> Transparent community service</span><span><HeartHandshake size={18} /> Built for everyone</span></div></div><div className="hero-card"><div className="hero-card-glow" /><div className="hero-card-content"><div className="account-details" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
      <div className="account-detail-row"><span>Bank</span><strong>UBL (Branch 1398)</strong></div>
      <div className="account-detail-row"><span>Account Title</span><strong>Aziz Ul Haq</strong></div>
      <div className="account-detail-row"><span>Account No</span><strong className="account-number">253566694</strong><button className="account-copy" onClick={() => copyAccount('253566694', 'account')}>{copiedAccount === 'account' ? 'Copied' : 'Copy'}</button></div>
      <div className="account-detail-row account-iban"><span>IBAN</span><strong className="account-number account-iban-value">PK62UNIL0109000253566694</strong><button className="account-copy" onClick={() => copyAccount('PK62UNIL0109000253566694', 'iban')}>{copiedAccount === 'iban' ? 'Copied' : 'Copy'}</button></div>
      <div className="account-detail-row"><span>EasyPaisa</span><strong className="account-number">03429395868</strong><button className="account-copy" onClick={() => copyAccount('03429395868', 'easypaisa')}>{copiedAccount === 'easypaisa' ? 'Copied' : 'Copy'}</button></div>
    </div></div></div></div></section><AdsBillboard ads={ads} /><section className="section intro-section"><div className="container section-heading"><div><span className="eyebrow">Everything in one place</span><h2>Ways to take part</h2></div><p>Choose a service, learn what is happening, and be part of the work that matters.</p></div><div className="container feature-grid">{sections.map((s) => <Link to={s.path} className={`feature-card ${s.tone}`} key={s.key}><span className="icon-box"><s.icon size={22} /></span><span><h3>{s.title}</h3><p>{s.description}</p></span><ArrowRight className="feature-arrow" size={19} /></Link>)}</div></section><section className="cabinet-strip cabinet-showcase"><div className="container"><div className="cabinet-slider" aria-label="Cabinet members slider"><div className="cabinet-slider-heading"><span className="eyebrow">✦ Jawkhela cabinet members</span><Link to="/cabinet" className="text-link">View cabinet <ArrowRight size={16} /></Link></div><div className="cabinet-stage"><button className="cabinet-nav cabinet-prev" aria-label="Previous cabinet member" onClick={() => setActiveCabinet((activeCabinet - 1 + cabinetMembers.length) % cabinetMembers.length)}><ChevronLeft size={24} /></button><div className="cabinet-side cabinet-side-left"><img src={cabinetMembers[(activeCabinet - 1 + cabinetMembers.length) % cabinetMembers.length].profileImage || '/zj-logo-emerald.png'} alt="" /></div><div className="cabinet-feature-card"><div className="cabinet-index">OPC / {String((activeCabinet % cabinetMembers.length) + 1).padStart(2, '0')}</div><img src={activeMember.profileImage || '/zj-logo-emerald.png'} alt={text(activeMember, 'name', 'fullName') || 'Cabinet member'} /></div><div className="cabinet-feature-info"><span>{text(activeMember, 'position', 'role') || 'Cabinet member'}</span><h2>{text(activeMember, 'name', 'fullName') || 'Jawkhela Youth Cabinet'}</h2><p>{text(activeMember, 'responsibilities') || 'Verified community elected leadership profile.'}</p></div><div className="cabinet-side cabinet-side-right"><img src={cabinetMembers[(activeCabinet + 1) % cabinetMembers.length].profileImage || '/zj-logo-emerald.png'} alt="" /></div><button className="cabinet-nav cabinet-next" aria-label="Next cabinet member" onClick={() => setActiveCabinet((activeCabinet + 1) % cabinetMembers.length)}><ChevronRight size={24} /></button></div><div className="cabinet-dots">{cabinetMembers.map((member, index) => <button key={member.id || index} className={index === activeCabinet % cabinetMembers.length ? 'active' : ''} aria-label={`Show cabinet member ${index + 1}`} onClick={() => setActiveCabinet(index)} />)}</div></div></div></section><section className="section updates-section"><div className="container updates-grid"><div><span className="eyebrow">From the community</span><h2>Latest updates</h2><p className="muted">Announcements, takaar, and news from Zwanan Jawkhela.</p></div><div className="updates-list">{news.slice(0, 3).map((item, i) => <Link className="update-item" to="/announcements" key={item.id || i}><span className="update-icon"><Bell size={17} /></span><span><b>{text(item, 'title', 'message') || 'Community announcement'}</b><small>{formatDate(item.date || item.createdAt || item.publishedDate)} · {text(item, 'category', 'type') || 'Update'}</small></span><ChevronRight size={17} /></Link>)}{!news.length && <EmptyState compact message="New community updates will appear here soon." />}</div></div></section></main>;
}
function AdsBillboard({ ads }: { ads: RecordItem[] }) {
  const fallbackAd: RecordItem = { title: 'Put your business in front of the community', description: 'Reach local families, overseas Pakistanis, and community supporters with a premium featured placement.', businessName: 'Your business here', cta: 'Book this space' };
  const adList = ads.length ? ads : [fallbackAd];
  const [activeAd, setActiveAd] = useState(0);
  useEffect(() => { if (adList.length < 2) return; const timer = window.setInterval(() => setActiveAd((current) => (current + 1) % adList.length), 5000); return () => window.clearInterval(timer); }, [adList.length]);
  const ad = adList[activeAd % adList.length];
  if (ad.imageUrl) return <section className="ads-wrap ads-image-wrap"><div className="container"><div className="ads-image-frame"><span className="ads-image-badge">SPONSORED</span><img src={ad.imageUrl} alt={text(ad, 'businessName', 'title') || 'Community advertisement'} /><div className="ads-image-caption"><strong>{text(ad, 'businessName', 'title') || 'Community partner'}</strong><span>{activeAd + 1} / {adList.length}</span></div></div></div></section>;
  return <section className="ads-wrap"><div className="container"><div className="ads-billboard"><div className="ads-light" /><div className="ads-copy"><span className="ads-kicker">Paid community spotlight</span><h2>{text(ad, 'title') || 'Put your business in front of the community'}</h2><p>{text(ad, 'description', 'content') || 'Reach local families and community supporters with a premium featured placement.'}</p><a className="ads-cta" href="mailto:ads@jawkhela-youth.vercel.app">{text(ad, 'cta') || 'Book this space'} <ArrowRight size={16} /></a></div><div className="ads-panel relative overflow-hidden flex-1 min-h-[160px] flex flex-col justify-center border border-white/10 ml-0 lg:ml-8 mt-6 lg:mt-0 rounded-2xl bg-white/5 p-6 backdrop-blur-md"><span className="ads-panel-tag relative z-10 mb-auto w-max text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2 py-1 rounded">FEATURED</span><div className="ads-panel-orb" /><b className="relative z-10 text-xl font-black text-white">{text(ad, 'businessName', 'brandName') || 'Your business here'}</b><small className="relative z-10 text-white/70 font-medium mt-1">Grow with Zwanan Jawkhela</small></div></div></div></section>;
}
function EmptyState({ message, compact = false }: { message: string; compact?: boolean }) { return <div className={compact ? 'empty compact' : 'empty'}><Activity size={24} /><p>{message}</p></div>; }
function CollectionPage() { const { type = '' } = useParams(); const section = sections.find((s) => s.path.slice(1) === type) || sections[2]; const [items, setItems] = useState<RecordItem[]>([]); useEffect(() => { readCollection(section.key).then(setItems); }, [section.key]); const records: RecordItem[] = section.key === 'cabinet' ? (items.length ? items : fallbackCabinet) : items; return <main className="page"><div className="container page-head"><Link to="/" className="back-link"><ChevronLeft size={16} /> Back home</Link><div className="eyebrow">Zwanan Jawkhela · Community services</div><h1>{section.title}</h1><p>{section.description}</p></div>{section.key === 'cabinet' ? <CabinetCarousel members={records} /> : section.key === 'candidates' ? <div className="container candidate-grid">{records.length ? records.map((item, i) => <div key={item.id || i}><CandidateCard item={item} /></div>) : <EmptyState message="No candidates have been added yet." />}</div> : <div className="container cards-list">{records.length ? records.map((item, i) => <div key={item.id || i}><DataCard item={item} section={section.title} /></div>) : <EmptyState message="This space is ready for community updates. Check back soon or contact the cabinet to contribute information." />}</div>}</main>; }
function CabinetCarousel({ members }: { members: RecordItem[] }) { const [active, setActive] = useState(0); useEffect(() => { if (members.length < 2) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % members.length), 4500); return () => window.clearInterval(timer); }, [members.length]); const member: RecordItem = members[active] || (fallbackCabinet[0] as RecordItem); const move = (direction: number) => setActive((active + direction + members.length) % members.length); return <section className="cabinet-showcase"><div className="container"><div className="cabinet-carousel"><button className="carousel-arrow prev" aria-label="Previous cabinet member" onClick={() => move(-1)}><ChevronLeft size={24} /></button><div className="cabinet-slide" key={member.id || member.name}><div className="cabinet-portrait">{member.profileImage ? <img src={member.profileImage} alt={text(member, 'name', 'fullName')} /> : <span>{(text(member, 'name', 'fullName') || 'ZJ').slice(0, 2).toUpperCase()}</span>}<i /></div><div className="cabinet-slide-copy"><span className="eyebrow">Serving with unity · {String(active + 1).padStart(2, '0')} / {String(members.length).padStart(2, '0')}</span><h2>{text(member, 'name', 'fullName') || 'Community leader'}</h2><strong>{text(member, 'position', 'role') || 'Cabinet member'}</strong><p>{text(member, 'responsibilities', 'description', 'bio') || 'Guiding the community through service, collaboration, and positive action.'}</p><Link to="/membership" className="button primary">Join the movement <ArrowRight size={17} /></Link></div></div><button className="carousel-arrow next" aria-label="Next cabinet member" onClick={() => move(1)}><ChevronRight size={24} /></button><div className="carousel-dots">{members.map((item, index) => <button key={item.id || index} aria-label={`Show ${text(item, 'name', 'fullName') || 'member'} slide`} className={index === active ? 'active' : ''} onClick={() => setActive(index)} />)}</div></div></div></section>; }
function CandidateCard({ item }: { item: RecordItem }) { return <article className="candidate-card">{item.photoUrl ? <img src={item.photoUrl} alt={text(item, 'fullName') || 'Candidate'} /> : <div className="candidate-photo-fallback">{(text(item, 'fullName') || 'C').slice(0,2).toUpperCase()}</div>}<div className="candidate-card-body"><span className="soft-tag">{text(item, 'position') || 'Candidate'}</span><h2>{text(item, 'fullName') || 'Community candidate'}</h2><p>{text(item, 'bio', 'details', 'manifesto') || 'Candidate details will be shared here.'}</p><div className="candidate-meta"><span>Voting starts: {item.votingStart || 'To be announced'}</span><span>Voting ends: {item.votingEnd || 'To be announced'}</span>{text(item, 'phone') && <span>Contact: {text(item, 'phone')}</span>}</div></div></article>; }

function DataCard({ item, section }: { item: RecordItem; section: string }) { return <article className="data-card"><div className="data-card-top"><span className="soft-tag">{text(item, 'category', 'type', 'status') || section}</span><span className="date">{formatDate(item.date || item.createdAt || item.startDate)}</span></div><h2>{text(item, 'title', 'name', 'fullName') || 'Community record'}</h2><p>{text(item, 'description', 'content', 'message', 'summary', 'responsibilities') || 'More details will be shared here as this community service grows.'}</p><div className="data-meta">{text(item, 'location', 'hospital', 'currentCountry') && <span>{text(item, 'location', 'hospital', 'currentCountry')}</span>}{text(item, 'position', 'urgency', 'priority') && <span>{text(item, 'position', 'urgency', 'priority')}</span>}</div></article>; }
function FormPage({ type }: { type: string }) { 
  const title = type === 'membership' ? 'Become a member' : type === 'bloodDonation' ? 'Blood donation request' : 'Overseas Pakistanis registration'; 
  const fields = type === 'membership' ? ['Full name', 'Father name', 'CNIC', 'Phone', 'Village / address', 'Blood group'] : type === 'bloodDonation' ? ['Patient name', 'Blood group', 'Hospital', 'Contact number', 'Urgency'] : ['Full name', 'Passport / CNIC', 'Current country', 'Current city', 'Phone', 'Home village']; 
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, type), {
        ...formData,
        message,
        status: type === 'bloodDonation' ? 'Active' : 'Pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setFormData({});
      setMessage('');
    } catch(err) {
      console.error(err);
      alert('Error submitting form.');
    }
    setLoading(false);
  };

  return <main className="page"><div className="container form-layout"><div className="form-intro"><Link to="/" className="back-link"><ChevronLeft size={16} /> Back home</Link><div className="eyebrow">Secure community form</div><h1>{title}</h1><p>Share your details with the Zwanan Jawkhela team. Your information is sent to the appropriate Firestore collection for review.</p><div className="form-points"><span><CheckCircle2 size={18} /> Reviewed by the cabinet</span><span><ShieldCheck size={18} /> Your details stay private</span></div></div>
  {success ? (
    <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">Successfully Submitted</h2>
      <p className="text-gray-600 mb-6">Your information has been sent to the administration.</p>
      <button onClick={() => setSuccess(false)} className="button primary">Submit another</button>
    </div>
  ) : (
  <form className="community-form" onSubmit={handleSubmit}><div className="form-grid">{fields.map((f) => <label key={f}>{f}<input required value={formData[f] || ''} onChange={(e) => setFormData({...formData, [f]: e.target.value})} placeholder={`Enter ${f.toLowerCase()}`} /></label>)}</div><label>Additional message<textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Tell us anything the team should know" /></label><button disabled={loading} className="button primary" type="submit">{loading ? 'Submitting...' : 'Submit for review'} <ArrowRight size={18} /></button></form>
  )}
  </div></main>; 
}
export default App;
