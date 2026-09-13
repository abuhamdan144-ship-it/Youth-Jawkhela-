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
  issueDate?: unknown;
  expiryDate?: unknown;
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
  const field = (label: string, value: string) => <div style={{ minWidth: 0 }}><div style={{ color: '#6b8177', fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>{label}</div><div style={{ color: darkGreen, fontSize: 24, lineHeight: 1.25, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div></div>;
  return <div style={{ width: CARD_WIDTH, height: CARD_HEIGHT, boxSizing: 'border-box', padding: 38, borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(135deg,#f9fcfa 0%,#fff 62%,#edf7f1 100%)', border: '5px solid #0b7958', boxShadow: '0 18px 36px #063d2d33', fontFamily: 'Arial,sans-serif', color: darkGreen }}>
    <div style={{ height: 116, margin: -38, marginBottom: 30, padding: '22px 38px', boxSizing: 'border-box', background: 'linear-gradient(110deg,#075c41,#0b8a64)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '4px solid #d7b64c' }}>
      <div><div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 1 }}>Zwanan Jawkhela</div><div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>YOUTH WELFARE COMMUNITY</div></div>
      <div dir="rtl" style={{ fontSize: 28, fontWeight: 800, whiteSpace: 'nowrap' }}>زوانان جوخیله تنظیم</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 34, alignItems: 'start' }}>
      {member.profileImageUrl ? <img src={member.profileImageUrl} alt="Member" crossOrigin="anonymous" style={{ width: 226, height: 286, objectFit: 'cover', border: '5px solid #d7b64c', borderRadius: 18, background: '#eaf4ee' }} /> : <div style={{ width: 226, height: 286, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #d7b64c', borderRadius: 18, background: '#eaf4ee', color: green, fontSize: 42, fontWeight: 900 }}>{initials}</div>}
      <div style={{ display: 'grid', gap: 20, paddingTop: 6 }}>{field('FULL NAME', name)}{field('MEMBERSHIP NUMBER', cardNo)}{field('CNIC / ID', cnic)}<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>{field('BLOOD GROUP', blood)}{field('VILLAGE', village)}</div></div>
    </div>
    <div style={{ marginTop: 20, paddingTop: 12, borderTop: '2px solid #d7b64c', display: 'flex', justifyContent: 'space-between', color: '#527165', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}><span>UNITY · RESPECT · SERVICE</span><span>PRIVATE COMMUNITY MEMBER ID</span></div>
  </div>;
}

export function MembershipCard({ member }: { member: MembershipCardData; variant?: string; demo?: boolean }) {
  return <div style={{ containerType: 'inline-size', width: '100%' }}><div style={{ position: 'relative', width: '100%', paddingTop: `${(CARD_HEIGHT / CARD_WIDTH) * 100}%` }}><div style={{ position: 'absolute', inset: 0, width: CARD_WIDTH, height: CARD_HEIGHT, transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}><FrontCard member={member} /></div></div></div>;
}

export default MembershipCard;

export function MembershipCardDemo() { return <MembershipCard member={{ fullName: 'YOUR NAME', cardNumber: 'ZJ-2026-000', bloodGroup: 'O+', village: 'Jawkhela' }} />; }
