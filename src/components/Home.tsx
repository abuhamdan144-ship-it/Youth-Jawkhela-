import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Users, Calendar, Newspaper, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function Home() {
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedEasyPaisa, setCopiedEasyPaisa] = useState(false);

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

  return (
    <div className="w-full">
      {/* Announcements Marquee */}
      <div className="bg-secondary text-white py-2 overflow-hidden flex items-center relative z-10 shadow-md">
        <div className="px-4 font-bold flex items-center gap-2 bg-secondary z-20 whitespace-nowrap">
          <Megaphone size={18} />
          <span>تکار (Takaar):</span>
        </div>
        <div className="animate-marquee whitespace-nowrap flex items-center text-sm md:text-base ml-4">
          <span className="mx-4 font-medium">• Zwanan Jawkhela Annual General Meeting scheduled for next month.</span>
          <span className="mx-4 font-medium">• Emergency blood donation required for member at Lady Reading Hospital Peshawar.</span>
          <span className="mx-4 font-medium">• Welcome to the new official portal of Zwanan Jawkhela Welfare Society.</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-accent text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Subtle pattern background could go here */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium backdrop-blur-sm">
              Unity • Development • Welfare
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-poppins">
              Empowering the Community of <span className="text-secondary">Jawkhela</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl font-inter leading-relaxed">
              Zwanan Jawkhela is a dedicated welfare organization uniting the local community and diaspora to foster development, provide emergency assistance, and preserve our shared heritage.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/membership" className="bg-primary hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2">
                Become a Member <ArrowRight size={18} />
              </Link>
              <Link to="/donate" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Support Our Cause
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="bg-gray-50 border-b border-gray-100 p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900">Donations & Contributions</h3>
              <p className="text-sm text-gray-500 mt-1">Your support drives our welfare projects</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Bank Details */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">UBL Bank</span>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">Branch: 1398</span>
                </div>
                <div className="space-y-1 mb-3 text-sm text-gray-600">
                  <p>Title: <span className="font-medium text-gray-900">Aziz Ul Haq</span></p>
                  <p className="font-mono bg-white px-2 py-1 rounded border border-gray-100 mt-1">Acct: 253566694</p>
                  <p className="font-mono bg-white px-2 py-1 rounded border border-gray-100 mt-1 break-all">IBAN: PK62UNIL0109000253566694</p>
                </div>
                <button 
                  onClick={() => copyToClipboard('PK62UNIL0109000253566694', 'bank')}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copiedBank ? <><CheckCircle2 size={16} className="text-green-500" /> Copied!</> : <><Copy size={16} /> Copy IBAN</>}
                </button>
              </div>

              {/* EasyPaisa */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">Easypaisa</span>
                </div>
                <div className="space-y-1 mb-3 text-sm text-gray-600">
                  <p>Title: <span className="font-medium text-gray-900">Azizul Haq</span></p>
                  <p className="font-mono text-lg font-bold text-gray-900 text-center py-2">0342-9395868</p>
                </div>
                <button 
                  onClick={() => copyToClipboard('03429395868', 'easypaisa')}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-primary hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {copiedEasyPaisa ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Number</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Initiatives</h2>
            <p className="text-lg text-gray-600">We work across multiple domains to ensure the continuous development and welfare of our community members, both locally and abroad.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Community Welfare', icon: <Users size={32} />, desc: 'Supporting local families, education initiatives, and healthcare access.' },
              { title: 'Emergency Blood', icon: <Calendar size={32} />, desc: 'A dedicated, secure database of member blood types for urgent medical needs.' },
              { title: 'Diaspora Network', icon: <Newspaper size={32} />, desc: 'Connecting overseas Pakistanis from Jawkhela to their roots.' },
              { title: 'Transparent Operations', icon: <CheckCircle2 size={32} />, desc: 'Elected cabinets, recorded minutes, and accountable funds management.' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="w-16 h-16 bg-green-100 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
