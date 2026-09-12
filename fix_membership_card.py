import re

with open('src/components/MembershipCard.tsx', 'r') as f:
    content = f.read()

new_content = """import React from 'react';

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

  const renderFront = () => (
    <div style={{ position: 'relative', width: '1011px', height: '638px', background: '#fff url(/member-card-gemini-front.png) center/cover no-repeat', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* Profile Image - positioned to fit the gold border */}
      <div style={{ position: 'absolute', left: '79px', top: '198px', width: '232px', height: '292px', borderRadius: '14px', overflow: 'hidden', background: '#e0e0e0', zIndex: 2 }}>
        {member.profileImageUrl ? (
          <img src={member.profileImageUrl} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', fontWeight: 'bold', color: '#064a35', background: 'linear-gradient(145deg, #d8f4e5, #75cfa7)' }}>
            {initials}
          </div>
        )}
      </div>

      {/* Name Patch */}
      <div style={{ position: 'absolute', left: '315px', top: '223px', width: '480px', height: '38px', background: 'white', zIndex: 1, display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
        <span style={{ fontSize: '24px', fontWeight: 800, color: '#064a35', textTransform: 'uppercase' }}>{name}</span>
      </div>

      {/* Card No Patch */}
      <div style={{ position: 'absolute', left: '315px', top: '272px', width: '480px', height: '38px', background: 'white', zIndex: 1, display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#064a35' }}>{cardNo}</span>
      </div>

      {/* Blood Group Patch */}
      <div style={{ position: 'absolute', left: '315px', top: '352px', width: '200px', height: '38px', background: 'white', zIndex: 1, display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
        <span style={{ fontSize: '22px', fontWeight: 800, color: '#064a35' }}>{blood}</span>
      </div>

      {/* Village Patch */}
      <div style={{ position: 'absolute', left: '575px', top: '352px', width: '220px', height: '38px', background: 'white', zIndex: 1, display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#064a35' }}>{village}</span>
      </div>

      {/* Blank Patch to cover "O+ Shaukat Khan" floating text */}
      <div style={{ position: 'absolute', left: '260px', top: '415px', width: '430px', height: '40px', background: 'white', zIndex: 1 }}></div>

    </div>
  );

  const renderBack = () => (
    <div style={{ position: 'relative', width: '1011px', height: '638px', background: '#fff url(/member-card-gemini-back.png) center/cover no-repeat', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Phone Patch */}
      <div style={{ position: 'absolute', left: '625px', top: '596px', width: '250px', height: '24px', background: 'white', zIndex: 1, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#064a35' }}>{phone}</span>
      </div>
    </div>
  );

  return (
    <div style={{ containerType: 'inline-size', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* FRONT */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.10%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1011px', height: '638px', transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}>
          {renderFront()}
        </div>
      </div>

      {/* BACK */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '63.10%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1011px', height: '638px', transform: 'scale(calc(100cqi / 1011))', transformOrigin: 'top left' }}>
          {renderBack()}
        </div>
      </div>

    </div>
  );
}

export default MembershipCard;
"""

with open('src/components/MembershipCard.tsx', 'w') as f:
    f.write(new_content)
