import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        const data: any[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center">Loading events...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <Calendar size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join our community gatherings, welfare drives, and general meetings. Check below for upcoming schedules.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-50 rounded-xl p-12 border border-gray-100 shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg">No upcoming events at the moment.</p>
          <p className="text-sm mt-2">We will update this space when new events are scheduled.</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow group">
                <div className="bg-primary text-white p-6 md:w-48 flex flex-col justify-center items-center text-center shrink-0">
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-90">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-5xl font-bold my-1">{eventDate.getDate()}</span>
                  <span className="text-sm font-medium opacity-90">{eventDate.getFullYear()}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-green-200">
                      {event.type || 'General'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-gray-600 mb-5 leading-relaxed">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-2">
                      <Clock size={18} className="text-primary" /> {event.time || 'TBA'}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={18} className="text-primary" /> {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
