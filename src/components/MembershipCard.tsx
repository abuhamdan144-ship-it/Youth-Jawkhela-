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
const CARD_HEIGHT = 569;
const green = '#087653';
const darkGreen = '#075c41';

function formatCardDate(value: unknown, fallback: string) {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value && 'toDate' in value && typeof value.toDate === 'function') return value.toDate().toLocaleDateString('en-GB');
  if (typeof value === 'object' && value && 'seconds' in value && typeof value.seconds === 'number') return new Date(value.seconds * 1000).toLocaleDateString('en-GB');
  return fallback;
}

function FrontCard({ member }: { member: MembershipCardData }) {
  const name = member.fullName || member.name || 'YOUR NAME';
  const cardNo = member.cardNumber || member.membershipNumber || 'PENDING';
  const blood = member.bloodGroup || member.bloodType || '—';
  const village = member.village || 'Location';
  const cnic = member.cnic || '00000-0000000-0';
  const initials = name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const field = (label: string, value: string, style: React.CSSProperties) => <div className="absolute overflow-hidden whitespace-nowrap" style={style}><small style={{ display: 'block', color: '#5a7a6e', fontSize: 10, fontWeight: 800, letterSpacing: 1.1 }}>{label}</small><strong style={{ display: 'block', color: darkGreen, fontSize: 24, lineHeight: 1.2, fontWeight: 800 }}>{value}</strong></div>;
  return (
    <div className="relative overflow-hidden bg-white" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: "url('/member-card-minimal-front-title.png') center / cover no-repeat", fontFamily: 'Arial, sans-serif' }}>
      {member.profileImageUrl ? <img src={member.profileImageUrl} alt="Member" crossOrigin="anonymous" className="absolute object-cover" style={{ left: 118, top: 199, width: 221, height: 276, border: '4px solid #087653', borderRadius: 12 }} /> : <div className="absolute flex items-center justify-center font-extrabold" style={{ left: 118, top: 199, width: 221, height: 276, border: '4px solid #087653', borderRadius: 12, background: '#eef7f1', color: green, fontSize: 28 }}>{initials}</div>}
      {field('FULL NAME', name, { left: 370, top: 218, width: 590 })}
      {field('MEMBERSHIP NUMBER', cardNo, { left: 370, top: 269, width: 590 })}
      {field('CNIC / ID', cnic, { left: 370, top: 320, width: 590 })}
      {field('BLOOD GROUP', blood, { left: 370, top: 371, width: 250 })}
      {field('VILLAGE', village, { left: 650, top: 371, width: 300 })}
    </div>
  );
}

export function MembershipCard({ member }: { member: MembershipCardData; variant?: string; demo?: boolean }) {
  return <div style={{ containerType: 'inline-size', width: '100%' }}><div style={{ position: 'relative', width: '100%', paddingTop: `${(CARD_HEIGHT / CARD_WIDTH) * 100}%` }}><div style={{ position: 'absolute', inset: 0, width: CARD_WIDTH, height: CARD_HEIGHT, transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}><FrontCard member={member} /></div></div></div>;
}

export default MembershipCard;

export function MembershipCardDemo() {
  return <MembershipCard member={{ fullName: 'YOUR NAME', cardNumber: 'ZJ-2026-000', bloodGroup: 'O+', village: 'Jawkhela' }} />;
}
