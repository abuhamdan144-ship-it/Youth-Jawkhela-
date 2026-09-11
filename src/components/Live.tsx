import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, limit, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Newspaper, Calendar as CalendarIcon, Droplet, Phone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function Live() {
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [cabinet, setCabinet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 3D Billboard State
  const [rotation, setRotation] = useState(0);

  // Blood Request Form State
  const [bloodForm, setBloodForm] = useState({ patientName: '', bloodGroup: 'A+', hospital: '', contact: '', urgency: 'High' });
  const [submittingBlood, setSubmittingBlood] = useState(false);
  const [bloodSuccess, setBloodSuccess] = useState(false);

  useEffect(() => {
    // 3D Billboard Rotation Interval
    const interval = setInterval(() => {
      setRotation(prev => prev - 90);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // Fetch News (Latest 3)
        const newsQ = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
        const newsSnap = await getDocs(newsQ);
        const newsData: any[] = [];
        newsSnap.forEach(d => newsData.push({ id: d.id, ...d.data() }));
        setNews(newsData);

        // Fetch Events (Latest 3)
        const eventsQ = query(collection(db, 'events'), orderBy('date', 'asc'), limit(3));
        const eventsSnap = await getDocs(eventsQ);
        const eventsData: any[] = [];
        eventsSnap.forEach(d => eventsData.push({ id: d.id, ...d.data() }));
        setEvents(eventsData);

        // Fetch Cabinet with Contact Numbers
        const cabQ = query(collection(db, 'cabinet'));
        const cabSnap = await getDocs(cabQ);
        const cabData: any[] = [];
        for (const docSnap of cabSnap.docs) {
          const data = docSnap.data();
          let phone = 'Contact Admin';
          if (data.userId) {
            const userRef = doc(db, 'users', data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && userSnap.data().phone) {
              phone = userSnap.data().phone;
            }
          }
          cabData.push({ id: docSnap.id, ...data, phone });
        }
        
        // Sort cabinet by hierarchy
        const order = ['Chairman', 'Vice-Chairman', 'Secretary', 'Treasurer', 'General Member'];
        cabData.sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position));
        setCabinet(cabData);

      } catch (error) {
        console.error("Error fetching live data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  const handleBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBlood(true);
    try {
      await addDoc(collection(db, 'bloodRequests'), {
        ...bloodForm,
        status: 'Active',
        createdAt: serverTimestamp()
      });
      setBloodSuccess(true);
      setBloodForm({ patientName: '', bloodGroup: 'A+', hospital: '', contact: '', urgency: 'High' });
      setTimeout(() => setBloodSuccess(false), 5000);
    } catch (error) {
      console.error("Blood request error", error);
      alert("Failed to submit request.");
    } finally {
      setSubmittingBlood(false);
    }
  };

  const billboardAds = [
    { id: 1, text: "Support Zwanan Jawkhela", subtext: "Donate to our welfare funds today", bg: "from-primary to-green-800" },
    { id: 2, text: "Upcoming General Meeting", subtext: "All members are requested to join", bg: "from-secondary to-yellow-600" },
    { id: 3, text: "Emergency Blood Drive", subtext: "Register as a donor to save lives", bg: "from-red-500 to-red-700" },
    { id: 4, text: "Community Development", subtext: "Building a better future together", bg: "from-accent to-blue-900" },
  ];

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center">Loading Live Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 3D Billboard Section */}
      <div className="bg-accent pt-10 pb-16 px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Live Community Dashboard</h1>
          <p className="text-gray-300">Real-time updates, emergency alerts, and active cabinet members.</p>
        </div>

        {/* 3D Rotating Cube Implementation */}
        <div className="max-w-3xl mx-auto h-48 md:h-64 relative" style={{ perspective: '1200px' }}>
          <div 
            className="w-full h-full relative" 
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: `translateZ(-150px) rotateX(${rotation}deg)`,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Front */}
            <div className={`absolute inset-0 bg-gradient-to-br ${billboardAds[0].bg} rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-white/10`} style={{ transform: 'rotateX(0deg) translateZ(150px)', backfaceVisibility: 'hidden' }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">{billboardAds[0].text}</h2>
              <p className="text-lg md:text-xl opacity-90">{billboardAds[0].subtext}</p>
            </div>
            {/* Top */}
            <div className={`absolute inset-0 bg-gradient-to-br ${billboardAds[1].bg} rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-white/10`} style={{ transform: 'rotateX(90deg) translateZ(150px)', backfaceVisibility: 'hidden' }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">{billboardAds[1].text}</h2>
              <p className="text-lg md:text-xl opacity-90">{billboardAds[1].subtext}</p>
            </div>
            {/* Back */}
            <div className={`absolute inset-0 bg-gradient-to-br ${billboardAds[2].bg} rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-white/10`} style={{ transform: 'rotateX(180deg) translateZ(150px)', backfaceVisibility: 'hidden' }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">{billboardAds[2].text}</h2>
              <p className="text-lg md:text-xl opacity-90">{billboardAds[2].subtext}</p>
            </div>
            {/* Bottom */}
            <div className={`absolute inset-0 bg-gradient-to-br ${billboardAds[3].bg} rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-white border-4 border-white/10`} style={{ transform: 'rotateX(-90deg) translateZ(150px)', backfaceVisibility: 'hidden' }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">{billboardAds[3].text}</h2>
              <p className="text-lg md:text-xl opacity-90">{billboardAds[3].subtext}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: News & Events */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live News */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Newspaper className="text-primary" /> Live News
                </h2>
              </div>
              <div className="space-y-4">
                {news.length === 0 ? <p className="text-gray-500">No news available.</p> : news.map(item => (
                  <div key={item.id} className="group p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      {item.category || 'Update'} &bull; {new Date(item.date).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarIcon className="text-secondary" /> Upcoming Events
                </h2>
              </div>
              <div className="space-y-4">
                {events.length === 0 ? <p className="text-gray-500">No events scheduled.</p> : events.map(event => (
                  <div key={event.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="bg-secondary/10 text-secondary rounded-lg p-3 flex flex-col items-center justify-center min-w-[70px]">
                      <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-2xl font-bold">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Clock size={14} /> {event.time || 'TBA'} &bull; {event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Blood Request Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <Droplet size={24} className="fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Emergency Blood</h2>
                    <p className="text-sm text-red-600 font-medium">Request Donation</p>
                  </div>
                </div>

                {bloodSuccess ? (
                  <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-200">
                    <CheckCircle2 size={40} className="mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">Request Broadcasted</h3>
                    <p className="text-sm">Our admins have been notified and will contact donors shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBloodRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <input required value={bloodForm.patientName} onChange={e => setBloodForm({...bloodForm, patientName: e.target.value})} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Patient's full name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <select value={bloodForm.bloodGroup} onChange={e => setBloodForm({...bloodForm, bloodGroup: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                        <select value={bloodForm.urgency} onChange={e => setBloodForm({...bloodForm, urgency: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hospital / City</label>
                      <input required value={bloodForm.hospital} onChange={e => setBloodForm({...bloodForm, hospital: e.target.value})} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="E.g. Lady Reading, Peshawar" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attendant Contact</label>
                      <input required value={bloodForm.contact} onChange={e => setBloodForm({...bloodForm, contact: e.target.value})} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Phone number" />
                    </div>
                    <button type="submit" disabled={submittingBlood} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                      {submittingBlood ? 'Submitting...' : <><AlertCircle size={18} /> Submit Urgent Request</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Cabinet Members Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Executive Cabinet</h2>
            <p className="text-gray-600 mt-2">Active leadership and their direct contact lines.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cabinet.length === 0 ? <p className="text-gray-500 col-span-full">No active cabinet members.</p> : cabinet.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-24 bg-gradient-to-r from-accent to-gray-800"></div>
              <div className="px-6 pb-6 relative">
                <div className="w-20 h-20 bg-white rounded-full p-1 absolute -top-10 left-6 shadow-md">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {member.profileImage ? (
                      <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">{member.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="mt-12">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded mb-2">{member.position}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{member.name}</h3>
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors">
                    <Phone size={16} className="text-primary" /> {member.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dummy Clock Icon component just for use in Live component
const Clock = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
