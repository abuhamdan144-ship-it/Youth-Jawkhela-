import React from 'react';

export interface MembershipCardData {
  fullName?: string;
  name?: string;
  cardNumber?: string;
  membershipNumber?: string;
  bloodGroup?: string;
  bloodType?: string;
  village?: string;
  phone?: string;
  profileImageUrl?: string;
  cnic?: string;
  issueDate?: string;
  expiryDate?: string;
}

const CARD_WIDTH = 1011;
const CARD_HEIGHT = 638;

function FrontCard({ member }: { member: MembershipCardData }) {
  const name = member.fullName || member.name || 'YOUR NAME';
  const cardNo = member.cardNumber || member.membershipNumber || 'PENDING';
  const blood = member.bloodGroup || member.bloodType || '—';
  const village = member.village || 'Location';
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="relative overflow-hidden bg-white" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: "url('/member-card-gemini-front.png') center / cover no-repeat" }}>
      {member.profileImageUrl ? (
        <img src={member.profileImageUrl} alt="Member" crossOrigin="anonymous" className="absolute object-cover" style={{ left: 76, top: 205, width: 235, height: 280, border: '5px solid #d4a928', borderRadius: 16 }} />
      ) : (
        <div className="absolute flex items-center justify-center font-extrabold" style={{ left: 76, top: 205, width: 235, height: 280, border: '5px solid #d4a928', borderRadius: 16, background: '#f3f6f3', color: '#075b43', fontSize: 28 }}>{initials}</div>
      )}
      <div className="absolute" style={{ left: 250, top: 235, width: 650, height: 75, background: '#f3f6f3' }} />
      <div className="absolute" style={{ left: 250, top: 350, width: 650, height: 75, background: '#f3f6f3' }} />
      <div className="absolute" style={{ left: 250, top: 465, width: 175, height: 62, background: '#f3f6f3' }} />
      <div className="absolute" style={{ left: 610, top: 465, width: 300, height: 62, background: '#f3f6f3' }} />
      <div className="absolute overflow-hidden whitespace-nowrap font-extrabold" style={{ left: 265, top: 245, width: 640, color: '#064a35', fontSize: 30, padding: '3px 12px' }}>{name}</div>
      <div className="absolute overflow-hidden whitespace-nowrap font-extrabold" style={{ left: 265, top: 360, width: 640, color: '#064a35', fontSize: 29, padding: '3px 12px' }}>{cardNo}</div>
      <div className="absolute overflow-hidden whitespace-nowrap font-bold" style={{ left: 265, top: 478, width: 175, color: '#064a35', fontSize: 24, padding: '2px 10px' }}>{blood}</div>
      <div className="absolute overflow-hidden whitespace-nowrap font-bold" style={{ left: 635, top: 478, width: 270, color: '#064a35', fontSize: 24, padding: '2px 10px' }}>{village}</div>
    </div>
  );
}

function BackCard({ member }: { member: MembershipCardData }) {
  const phone = member.phone || '+92 Community Helpline';
  return (
    <div className="relative overflow-hidden bg-white" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: "url('/member-card-gemini-back.png') center / cover no-repeat" }}>
      <div className="absolute" style={{ left: 640, top: 466, width: 310, height: 45, background: '#f3f6f3' }} />
      <div className="absolute overflow-hidden whitespace-nowrap font-bold" style={{ left: 645, top: 472, width: 300, color: '#064a35', fontSize: 22, padding: '3px 10px' }}>{phone}</div>
    </div>
  );
}

export function MembershipCard({ member }: { member: MembershipCardData; variant?: string; demo?: boolean }) {
  return (
    <div style={{ containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {[<FrontCard member={member} />, <BackCard member={member} />].map((card, index) => (
        <div key={index} style={{ position: 'relative', width: '100%', paddingTop: `${(CARD_HEIGHT / CARD_WIDTH) * 100}%` }}>
          <div style={{ position: 'absolute', inset: 0, width: CARD_WIDTH, height: CARD_HEIGHT, transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}>{card}</div>
        </div>
      ))}
    </div>
  );
}

export default MembershipCard;

export function MembershipCardDemo() {
  return <MembershipCard member={{ fullName: 'YOUR NAME', cardNumber: 'ZJ-2026-000', bloodGroup: 'O+', village: 'Jawkhela' }} />;
}
