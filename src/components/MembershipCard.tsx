import React from 'react';
import { ShieldCheck, QrCode, MapPin, CalendarDays, Phone, HeartHandshake, Globe2 } from 'lucide-react';

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

function CardBrand() {
  return <div className="membership-card__brand"><span className="membership-card__mark"><img src="/zj-logo-emerald.png" alt="Zwanan Jawkhela logo" /></span><span><strong>Zwanan Jawkhela</strong><small>Youth Welfare Community</small></span></div>;
}

export function MembershipCard({ member, variant = 'midnight', demo = false }: { member: MembershipCardData; variant?: CardVariant; demo?: boolean }) {
  const name = member.fullName || 'SHAUKAT KHAN YOUSAF';
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`membership-card-pair membership-card-pair--id3d ${variantClasses[variant]}`} aria-label={`${name} private community membership card`}>
      <article className="membership-card membership-card--front">
        <div className="membership-card__shine" />
        <div className="membership-card__topline"><CardBrand /><span className="membership-card__status"><ShieldCheck size={13} /> PRIVATE MEMBER ID</span></div>
        <div className="membership-card__front-body">
          <div className="membership-card__portrait">{member.profileImageUrl ? <img src={member.profileImageUrl} alt="" /> : <span>{initials}</span>}</div>
          <div className="membership-card__identity"><small>OFFICIAL MEMBER</small><h3>{name}</h3><p>{member.cardNumber || 'ZJ-2026-650'}</p></div>
          <div className="membership-card__qr"><QrCode size={48} /><small>SCAN</small></div>
        </div>
        <div className="membership-card__details"><span><b>BLOOD</b>{member.bloodGroup || 'O+'}</span><span><b>VILLAGE</b>{member.village || 'Jawkhela'}</span><span><b>VALID THROUGH</b>{member.expiryDate || '30 Sep 2027'}</span></div>
        <div className="membership-card__footer"><span><MapPin size={12} /> Jawkhela, Pakistan</span><span><Phone size={12} /> Community service card</span></div>
        {demo && <span className="membership-card__demo">FRONT · DESIGN DEMO</span>}
      </article>
      <article className="membership-card membership-card--back">
        <div className="membership-card__back-grid" />
        <div className="membership-card__back-content"><CardBrand /><div className="membership-card__back-rule" /><div className="membership-card__back-columns"><div><span className="membership-card__back-kicker">MEMBER BENEFITS</span><h3>Unity · Respect · Culture · Service</h3><p>Community networking, social support, educational resources, advocacy and welfare for approved members.</p></div><div className="membership-card__back-qr"><QrCode size={72} /><small>MEMBER ID<br /><b>{member.cardNumber || 'ZJ-2026-650'}</b></small></div></div><div className="membership-card__back-info"><span><b>WEB</b>jawkhela-youth.vercel.app</span><span><b>HELPLINE</b>{member.phone || '+92 Community Helpline'}</span><span><b>VALIDITY</b>{member.expiryDate || 'Valid for lifetime'}</span></div><div className="membership-card__back-footer"><span><HeartHandshake size={13} /> Welfare · Unity · Service</span><span><Globe2 size={13} /> jawkhela-youth.vercel.app</span></div></div>
        {demo && <span className="membership-card__demo">BACK · DESIGN DEMO</span>}
      </article>
    </div>
  );
}

export function MembershipCardDemo() {
  const member: MembershipCardData = { fullName: 'Shaukat Khan Yousaf', cardNumber: 'ZJ-2026-650', bloodGroup: 'O+', village: 'Jawkhela', cnic: '35202-1234567-1', phone: '+92 300 1234567', issueDate: '12 Sep 2026', expiryDate: '30 Sep 2027' };
  return <main className="card-demo"><div className="container"><div className="card-demo__heading"><span className="eyebrow">Private community membership ID · two-sided</span><h1>Normal 3D member card</h1><p>Clean horizontal plastic ID-card styling with a green national-inspired palette, portrait area, membership number, chip detail, and matching reverse side. This is a private community card, not a government CNIC.</p></div><div className="card-demo__grid"><div><MembershipCard member={member} variant="midnight" demo /><h2>Private Zwanan Jawkhela member ID</h2><p>Pakistan-style horizontal card proportions with a subtle 3D plastic finish and front/back presentation.</p></div></div></div></main>;
}

export default MembershipCard;
