import React from 'react';

export interface MembershipCardData {
  fullName?: string;
  name?: string;
  cardNumber?: string;
  membershipNumber?: string;
  bloodGroup?: string;
  bloodType?: string;
  village?: string;
  address?: string;
  phone?: string;
  issueDate?: string;
  expiryDate?: string;
  profileImageUrl?: string;
  status?: string;
  cnic?: string;
}

export function MembershipCard({ member, variant = 'midnight', demo = false }: { member: MembershipCardData; variant?: string; demo?: boolean }) {
  const name = member.fullName || member.name || 'COMMUNITY MEMBER';
  const cardNo = member.cardNumber || member.membershipNumber || 'ZJ-2026-000';
  const blood = member.bloodGroup || member.bloodType || '—';
  const village = member.village || 'Jawkhela';
  const phone = member.phone || '+92 300 1234567';
  const cnic = member.cnic || '00000-0000000-0';
  
  // Use a fallback for the portrait if none is provided
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const renderFront = () => (
    <div style={{ width: '600px', height: '380px' }} className="relative rounded-2xl overflow-hidden shadow-2xl bg-emerald-950 font-sans border border-emerald-500/30">
      {/* 3D Glass Background Orbs */}
      <div className="absolute top-[-50px] left-[-50px] w-[250px] h-[250px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[60px] opacity-40"></div>
      <div className="absolute bottom-[-100px] right-[-50px] w-[350px] h-[350px] bg-teal-400 rounded-full mix-blend-screen filter blur-[90px] opacity-30"></div>
      <div className="absolute top-[20%] right-[10%] w-[150px] h-[150px] bg-amber-400 rounded-full mix-blend-screen filter blur-[70px] opacity-20"></div>

      {/* Glass Panel Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center p-5 border-b border-white/10 bg-black/20">
          <img src="/zj-logo-emerald.png" alt="Logo" className="w-14 h-14 mr-4 bg-white rounded-full p-1 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
          <div className="flex-1">
            <h1 className="text-[22px] font-black tracking-widest text-white uppercase m-0 leading-tight drop-shadow-md">Zwanan Jawkhela</h1>
            <p className="text-emerald-200 text-[11px] font-bold tracking-[0.25em] uppercase m-0 drop-shadow">Youth Welfare & Community</p>
          </div>
          <div className="text-right">
            <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 text-[11px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)] border border-amber-300">
              Private ID
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 p-6 gap-8 items-center">
          {/* Photo inside glass frame */}
          <div className="w-[140px] flex flex-col shrink-0">
            <div className="w-[140px] h-[175px] bg-black/40 rounded-xl overflow-hidden border-[3px] border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm p-1">
              {member.profileImageUrl ? (
                <img src={member.profileImageUrl} alt="Member" className="w-full h-full object-cover rounded-lg" crossOrigin="anonymous" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-white/10 rounded-lg">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Details (Glass text styles) */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] block mb-1 font-bold drop-shadow">Member Name</span>
              <div className="text-[22px] font-black text-white uppercase tracking-wider leading-none drop-shadow-lg">{name}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] block mb-1 font-bold drop-shadow">ID Number</span>
                <div className="text-[16px] font-bold text-white leading-none tracking-wide drop-shadow-md bg-black/20 py-1.5 px-3 rounded border border-white/10 inline-block">{cnic}</div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] block mb-1 font-bold drop-shadow">Card Number</span>
                <div className="text-[16px] font-bold text-white leading-none tracking-wide drop-shadow-md bg-black/20 py-1.5 px-3 rounded border border-white/10 inline-block">{cardNo}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] block mb-1 font-bold drop-shadow">Blood Group</span>
                <div className="inline-flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 text-white px-4 py-1.5 rounded-lg text-lg font-black shadow-[0_4px_15px_rgba(239,68,68,0.5)] border border-red-400">
                  {blood}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 uppercase tracking-[0.2em] block mb-1 font-bold drop-shadow">Village / Location</span>
                <div className="text-[16px] font-bold text-white leading-none drop-shadow-md pt-1.5">{village}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/30 px-6 py-3 flex justify-between items-end border-t border-white/10">
          <div className="flex gap-8">
            <div>
              <span className="block text-[8px] text-emerald-400/80 uppercase tracking-widest mb-1 font-bold">Issue Date</span>
              <span className="block text-[11px] font-bold text-emerald-100">{member.issueDate || '01 Jan 2026'}</span>
            </div>
            <div>
              <span className="block text-[8px] text-emerald-400/80 uppercase tracking-widest mb-1 font-bold">Valid Until</span>
              <span className="block text-[11px] font-bold text-emerald-100">{member.expiryDate || '31 Dec 2027'}</span>
            </div>
          </div>
          <div className="w-32 border-b border-white/30 pb-1.5 text-center">
            <span className="block text-[8px] text-emerald-400/80 uppercase tracking-widest font-bold">Auth Signature</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBack = () => (
    <div style={{ width: '600px', height: '380px' }} className="relative rounded-2xl overflow-hidden shadow-2xl bg-emerald-950 font-sans border border-emerald-500/30">
      {/* 3D Glass Background Orbs */}
      <div className="absolute top-[-50px] right-[-50px] w-[250px] h-[250px] bg-teal-500 rounded-full mix-blend-screen filter blur-[70px] opacity-30"></div>
      <div className="absolute bottom-[-100px] left-[-50px] w-[350px] h-[350px] bg-emerald-400 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>

      {/* Glass Panel Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col z-10">
        
        {/* Magnetic Strip Illusion */}
        <div className="h-14 bg-black/60 w-full mt-6 shadow-inner border-y border-white/10 backdrop-blur-md"></div>
        
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div className="bg-black/20 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
            <h3 className="font-bold text-emerald-300 mb-3 uppercase tracking-[0.2em] text-[11px] flex items-center gap-3">
              <span className="w-6 h-px bg-emerald-400/50"></span>
              Terms and Conditions
              <span className="flex-1 h-px bg-emerald-400/50"></span>
            </h3>
            <ul className="list-disc pl-5 text-[11px] space-y-2 text-emerald-50 font-medium leading-relaxed opacity-90">
              <li>This card remains the property of Zwanan Jawkhela Youth Welfare.</li>
              <li>It must be presented upon request by authorized personnel.</li>
              <li>In case of loss, please report immediately to the administration.</li>
              <li>This card is non-transferable and intended for community use only.</li>
              <li>Misuse of this card may result in cancellation of membership privileges.</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex justify-between items-center">
            <div>
              <span className="block text-[9px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Emergency / Helpline</span>
              <span className="font-black text-white text-[16px] drop-shadow-md tracking-wider">{phone}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Return Address</span>
              <span className="font-bold text-emerald-50 text-[11px]">Jawkhela, Swat, KPK, Pakistan</span>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 w-full shadow-[0_-5px_15px_rgba(251,191,36,0.2)]"></div>
      </div>
    </div>
  );

  return (
    <div style={{ containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* FRONT */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.33%', borderRadius: '16px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '600px', height: '380px', transform: 'scale(calc(100cqi / 600))', transformOrigin: 'top left' }}>
          {renderFront()}
        </div>
      </div>

      {/* BACK */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.33%', borderRadius: '16px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '600px', height: '380px', transform: 'scale(calc(100cqi / 600))', transformOrigin: 'top left' }}>
          {renderBack()}
        </div>
      </div>

    </div>
  );
}

export default MembershipCard;

