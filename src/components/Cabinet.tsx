import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, FileText, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Cabinet as CabinetType, CabinetMeeting } from '../types';

export function Cabinet() {
  const [cabinet, setCabinet] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<CabinetMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active cabinet members
        const cabQuery = query(collection(db, 'cabinet'));
        const cabSnapshot = await getDocs(cabQuery);
        const cabList: any[] = [];
        cabSnapshot.forEach((doc) => cabList.push({ id: doc.id, ...doc.data() }));
        
        // Sort by hierarchy (simplified)
        const order = ['Chairman', 'Vice-Chairman', 'Secretary', 'Treasurer', 'General Member'];
        cabList.sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position));
        setCabinet(cabList);

        // Fetch recent meetings
        const meetQuery = query(collection(db, 'cabinetMeetings'), orderBy('date', 'desc'), limit(5));
        const meetSnapshot = await getDocs(meetQuery);
        const meetList: any[] = [];
        meetSnapshot.forEach((doc) => meetList.push({ id: doc.id, ...doc.data() }));
        setMeetings(meetList);
      } catch (error) {
        console.error("Error fetching cabinet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading cabinet data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
          <Users size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Executive Cabinet</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the dedicated individuals serving the Zwanan Jawkhela community. Our democratically elected cabinet ensures transparent and effective operations.
        </p>
      </div>

      {/* Cabinet Grid */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Current Office Bearers</h2>
        {cabinet.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-50 rounded-xl p-8 border border-gray-100">
            Cabinet members will be announced shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cabinet.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-24 bg-accent"></div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 bg-white rounded-full p-1 absolute -top-10 left-6">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {member.profileImage ? (
                        <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="text-gray-400" size={32} />
                      )}
                    </div>
                  </div>
                  <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {member.responsibilities || 'Dedicated to the welfare and development of the Zwanan Jawkhela community.'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 gap-2">
                      <CalendarIcon size={14} />
                      <span>Term: {member.tenure?.startDate ? new Date(member.tenure.startDate).getFullYear() : '2024'} - {member.tenure?.endDate ? new Date(member.tenure.endDate).getFullYear() : '2025'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meeting Summaries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Recent Cabinet Meetings</h2>
        {meetings.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-50 rounded-xl p-8 border border-gray-100">
            No meeting records found.
          </div>
        ) : (
          <div className="space-y-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cabinet Meeting</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><CalendarIcon size={16} className="text-primary" /> {new Date(meeting.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} className="text-primary" /> {meeting.location}</span>
                    </div>
                  </div>
                  {meeting.minutesDocument && (
                    <a href={meeting.minutesDocument} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:text-green-700 bg-green-50 px-4 py-2 rounded-lg font-medium transition-colors">
                      <FileText size={18} /> Download Minutes
                    </a>
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-600 border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-gray-900 font-semibold mb-2">Meeting Summary</h4>
                  <p className="whitespace-pre-wrap">{meeting.summary}</p>
                  
                  {meeting.decisions && meeting.decisions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-gray-900 font-semibold mb-2">Key Decisions</h4>
                      <ul className="list-disc list-inside">
                        {meeting.decisions.map((decision, idx) => (
                          <li key={idx}>{decision}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
