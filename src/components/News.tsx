import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Newspaper, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

export function News() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const data: any[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setNewsList(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center">Loading news...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
          <Newspaper size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Community News & Announcements</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay up to date with the latest developments, welfare initiatives, and announcements from Zwanan Jawkhela.
        </p>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-50 rounded-xl p-12 border border-gray-100 shadow-sm">
          <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg">No news articles found.</p>
          <p className="text-sm mt-2">Check back later for updates from the community.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 border-b border-gray-100">
                    <Newspaper size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {item.category || 'Announcement'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                  <CalendarIcon size={14} className="text-primary" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{item.content}</p>
                <button className="text-primary font-bold hover:text-green-700 flex items-center gap-1.5 transition-colors text-sm uppercase tracking-wide">
                  Read Full Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
