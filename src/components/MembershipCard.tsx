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

function BackCard({ member }: { member: MembershipCardData }) {
  const phone = member.phone || '+92 Community Helpline';
  const issue = member.issueDate || '2026';
  const expiry = member.expiryDate || '30 Sep 2027';
  return (
    <div className="relative overflow-hidden bg-white" style={{ width: CARD_WIDTH, height: CARD_HEIGHT, background: "url('/member-card-minimal-back-title.png') center / cover no-repeat", fontFamily: 'Arial, sans-serif' }}>
      <div className="absolute" style={{ left: 94, top: 122, width: 620, color: darkGreen }}><div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>MEMBER BENEFITS</div><div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, color: '#4a6c5f', fontSize: 16, fontWeight: 700 }}><span>• Community networking</span><span>• Social support</span><span>• Educational resources</span><span>• Advocacy and welfare</span></div></div>
      <div className="absolute text-center" style={{ left: 755, top: 145, width: 155, color: '#58796c', fontSize: 12, fontWeight: 800 }}>SCAN FOR<br />VERIFICATION</div>
      <div className="absolute" style={{ left: 120, top: 485, color: darkGreen, fontSize: 15, fontWeight: 800 }}>PHONE: {phone}</div>
      <div className="absolute" style={{ left: 575, top: 485, color: darkGreen, fontSize: 15, fontWeight: 800 }}>ISSUED: {issue} · VALID: {expiry}</div>
    </div>
  );
}

export function MembershipCard({ member }: { member: MembershipCardData; variant?: string; demo?: boolean }) {
  return <div style={{ containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>{[<FrontCard member={member} />, <BackCard member={member} />].map((card, index) => <div key={index} style={{ position: 'relative', width: '100%', paddingTop: `${(CARD_HEIGHT / CARD_WIDTH) * 100}%` }}><div style={{ position: 'absolute', inset: 0, width: CARD_WIDTH, height: CARD_HEIGHT, transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}>{card}</div></div>)}</div>;
}

export default MembershipCard;

export function MembershipCardDemo() {
  return <MembershipCard member={{ fullName: 'YOUR NAME', cardNumber: 'ZJ-2026-000', bloodGroup: 'O+', village: 'Jawkhela' }} />;
}
