import React from 'react';
import { ShieldCheck, QrCode, MapPin, CalendarDays, Phone } from 'lucide-react';

type CardVariant = 'emerald' | 'light' | 'midnight';

export type MembershipCardData = {
  fullName?: string;
  cardNumber?: string;
  bloodGroup?: string;
  cnic?: string;
  village?: string;
  phone?: string;
  issueDate?: string;
  expiryDate?: string;
  profileImageUrl?: string;
};

const variantClasses: Record<CardVariant, string> = {
  emerald: 'membership-card--emerald',
  light: 'membership-card--light',
  midnight: 'membership-card--midnight',
};

export function MembershipCard({ member, variant = 'emerald', demo = false }: { member: MembershipCardData; variant?: CardVariant; demo?: boolean }) {
  const name = member.fullName || 'SHAUKAT KHAN YOUSAF';
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  return (
    <article className={`membership-card ${variantClasses[variant]}`} aria-label={`${name} membership card`}>
      <div className="membership-card__shine" />
      <div className="membership-card__topline">
        <div className="membership-card__brand"><span className="membership-card__mark"><img src="/zj-logo-emerald.png" alt="Zwanan Jawkhela logo" /></span><span><strong>Zwanan Jawkhela</strong><small>Youth Welfare Community</small></span></div>
        <span className="membership-card__status"><ShieldCheck size={13} /> VERIFIED</span>
      </div>
      <div className="membership-card__body">
        <div className="membership-card__portrait">{member.profileImageUrl ? <img src={member.profileImageUrl} alt="" /> : <span>{initials}</span>}</div>
        <div className="membership-card__identity"><small>OFFICIAL MEMBER</small><h3>{name}</h3><p>{member.cardNumber || 'ZJ-2026-650'}</p></div>
        <div className="membership-card__qr"><QrCode size={48} /><small>SCAN</small></div>
      </div>
      <div className="membership-card__details">
        <span><b>BLOOD</b>{member.bloodGroup || 'O+'}</span>
        <span><b>VILLAGE</b>{member.village || 'Jawkhela'}</span>
        <span><b>VALID THROUGH</b>{member.expiryDate || '30 Sep 2027'}</span>
      </div>
      <div className="membership-card__footer"><span><MapPin size={12} /> Jawkhela, Pakistan</span><span><Phone size={12} /> Community service card</span></div>
      {demo && <span className="membership-card__demo">DESIGN DEMO</span>}
    </article>
  );
}

export function MembershipCardDemo() {
  const member: MembershipCardData = { fullName: 'Shaukat Khan Yousaf', cardNumber: 'ZJ-2026-650', bloodGroup: 'O+', village: 'Jawkhela', expiryDate: '30 Sep 2027' };
  return <main className="card-demo"><div className="container"><div className="card-demo__heading"><span className="eyebrow">Membership identity system</span><h1>Choose your membership card</h1><p>Three directions using the Zwanan Jawkhela light-green, black, and deep-emerald palette. The Emerald design is implemented as the default downloadable card.</p></div><div className="card-demo__grid"><div><MembershipCard member={member} variant="emerald" demo /><h2>01 · Emerald official</h2><p>Primary design: high contrast, verified badge, QR-ready identity area.</p></div><div><MembershipCard member={member} variant="light" demo /><h2>02 · Light community</h2><p>Friendly light-green layout for everyday member profiles.</p></div><div><MembershipCard member={member} variant="midnight" demo /><h2>03 · Midnight premium</h2><p>Dark formal direction for leadership and special membership tiers.</p></div></div></div></main>;
}

export default MembershipCard;
