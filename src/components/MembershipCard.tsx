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
  
  // Use a fallback for the portrait if none is provided
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const cnic = member.cnic || '00000-0000000-0';

  const renderFront = () => (
    <div style={{ width: '600px', height: '380px' }} className="relative bg-emerald-900 text-white overflow-hidden flex flex-col font-sans border-2 border-emerald-800">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-300 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center p-5 border-b border-emerald-800/60 bg-emerald-950/40 backdrop-blur-sm">
        <img src="/zj-logo-emerald.png" alt="Logo" className="w-12 h-12 mr-4 bg-white rounded-full p-1 border border-emerald-500" />
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-wider text-emerald-50 uppercase m-0 leading-tight">Zwanan Jawkhela</h1>
          <p className="text-emerald-300 text-[10px] font-bold tracking-[0.2em] uppercase m-0">Youth Welfare & Community</p>
        </div>
        <div className="text-right">
          <div className="px-4 py-1.5 bg-amber-500 text-amber-950 text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg">
            Member
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-1 p-5 gap-6 items-center">
        {/* Photo */}
        <div className="w-32 flex flex-col shrink-0">
          <div className="w-32 h-40 bg-gray-200 rounded-xl overflow-hidden border-[3px] border-emerald-500/50 shadow-inner">
            {member.profileImageUrl ? (
              <img src={member.profileImageUrl} alt="Member" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-emerald-800 bg-emerald-100">
                {initials}
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1 font-bold">Blood Group</span>
            <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-lg text-lg font-black shadow-md border border-red-500">
              {blood}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-0.5 font-bold">Full Name</span>
            <div className="text-xl font-bold text-white uppercase tracking-wide leading-none">{name}</div>
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-0.5 font-bold">CNIC / ID Number</span>
            <div className="text-[15px] font-semibold text-emerald-50 leading-none tracking-wide">{cnic}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-0.5 font-bold">Card No</span>
              <div className="text-[15px] font-semibold text-emerald-50 leading-none">{cardNo}</div>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-0.5 font-bold">Village / Area</span>
              <div className="text-[15px] font-semibold text-emerald-50 leading-none">{village}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-emerald-950/80 px-5 py-3 flex justify-between items-end border-t border-emerald-900">
        <div className="flex gap-8">
          <div>
            <span className="block text-[9px] text-emerald-500 uppercase tracking-widest mb-1 font-bold">Issue Date</span>
            <span className="block text-xs font-semibold text-emerald-100">{member.issueDate || '01 Jan 2026'}</span>
          </div>
          <div>
            <span className="block text-[9px] text-emerald-500 uppercase tracking-widest mb-1 font-bold">Valid Until</span>
            <span className="block text-xs font-semibold text-emerald-100">{member.expiryDate || '31 Dec 2027'}</span>
          </div>
        </div>
        <div className="w-32 border-b border-emerald-700/80 pb-1.5 text-center">
          <span className="block text-[8px] text-emerald-500 uppercase tracking-widest font-bold">Auth Signature</span>
        </div>
      </div>
    </div>
  );

  const renderBack = () => (
    <div style={{ width: '600px', height: '380px' }} className="relative bg-emerald-50 text-emerald-950 overflow-hidden flex flex-col font-sans border-2 border-emerald-200">
      <div className="h-14 bg-emerald-900 w-full mt-6 shadow-inner"></div>
      
      <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
        <div>
          <h3 className="font-bold text-emerald-800 mb-4 uppercase tracking-wider text-[12px] flex items-center gap-3">
            <span className="w-6 h-px bg-emerald-300"></span>
            Terms and Conditions
            <span className="flex-1 h-px bg-emerald-300"></span>
          </h3>
          <ul className="list-disc pl-5 text-[12px] space-y-2.5 text-emerald-800 font-medium leading-relaxed">
            <li>This card is the property of Zwanan Jawkhela Youth Welfare.</li>
            <li>It must be presented upon request by authorized personnel.</li>
            <li>In case of loss, please report immediately to the administration.</li>
            <li>This card is non-transferable and intended for community use only.</li>
            <li>Misuse of this card may result in cancellation of membership.</li>
          </ul>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded-xl border border-emerald-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Emergency / Contact</span>
              <span className="font-black text-emerald-900 text-[15px]">{phone}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Return Address</span>
              <span className="font-bold text-emerald-900 text-[12px]">Jawkhela, Swat, KPK, Pakistan</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-4 bg-amber-500 w-full"></div>
    </div>
  );

  return (
    <div style={{ containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* FRONT */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.33%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '600px', height: '380px', transform: 'scale(calc(100cqi / 600))', transformOrigin: 'top left', borderRadius: '16px', overflow: 'hidden' }}>
          {renderFront()}
        </div>
      </div>

      {/* BACK */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.33%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '600px', height: '380px', transform: 'scale(calc(100cqi / 600))', transformOrigin: 'top left', borderRadius: '16px', overflow: 'hidden' }}>
          {renderBack()}
        </div>
      </div>

    </div>
  );
}

export default MembershipCard;
