import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Users, HeartHandshake, BookOpen, Megaphone, Repeat, Globe2, Phone } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface MembershipCardData {
  fullName?: string;
  fatherName?: string;
  name?: string;
  cardNumber?: string;
  membershipNumber?: string;
  bloodGroup?: string;
  bloodType?: string;
  village?: string;
  address?: string;
  phone?: string;
  cnic?: string;
  profileImageUrl?: string;
  issueDate?: string;
  expiryDate?: string;
  status?: string;
}

export function MembershipCard({ 
  member, 
  isPdfMode = false,
  side = 'front' 
}: { 
  member: MembershipCardData; 
  isPdfMode?: boolean;
  side?: 'front' | 'back';
}) {
  const [showBack, setShowBack] = useState(side === 'back');

  // Normalize data
  const name = member.fullName || member.name || 'COMMUNITY MEMBER';
  const fatherName = member.fatherName || '—';
  const cardNo = member.cardNumber || member.membershipNumber || `ZJ-${new Date().getFullYear()}-0001`;
  const blood = member.bloodGroup || member.bloodType || '—';
  const village = member.village || member.address || '—';
  const phone = member.phone || '—';
  const cnic = member.cnic || '—';
  const issueDate = member.issueDate || '01 Jan 2026';
  const expiryDate = member.expiryDate || '31 Dec 2027';
  const status = member.status || 'PENDING APPROVAL';
  
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const qrValue = `ZJ-ID:${cnic}|${cardNo}`;
  const isApproved = status.toLowerCase().includes('approved') || status.toLowerCase().includes('active');

  const CardFront = () => (
    <div id={isPdfMode ? "card-pdf-front" : undefined} className="relative w-[600px] h-[380px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200 font-sans flex flex-col text-gray-900 bg-gradient-to-br from-white to-gray-50 shrink-0">
      {/* Header Background */}
      <div className="absolute top-0 left-0 w-full h-[95px] bg-emerald-900 flex items-center px-6 shadow-md">
        {/* Geometric shape for depth */}
        <div className="absolute top-0 right-0 w-[45%] h-full bg-emerald-950" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
        <img src="/zwanan-jawkhela-seal.jpeg" alt="Zwanan Jawkhela seal" className="w-16 h-16 object-contain relative z-10 drop-shadow-lg rounded-full" crossOrigin="anonymous" />
        <div className="ml-5 relative z-10 flex flex-col justify-center text-white pt-1">
          <h2 className="text-[22px] font-bold mb-1" style={{ fontFamily: 'system-ui, sans-serif' }} dir="rtl">زوانان جوخیله تنظیم</h2>
          <h1 className="text-[12px] font-black uppercase opacity-95">Zwanan Jawkhela Youth Welfare</h1>
        </div>
      </div>

      {/* Gold Strip */}
      <div className="absolute top-[95px] left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-sm z-20"></div>

      {/* Body Content */}
      <div className="absolute top-[108px] left-0 w-full px-7 py-3 flex gap-7 z-10">
        {/* Left Column: Photo & Status */}
        <div className="w-[125px] shrink-0 flex flex-col items-center">
          <div className="w-[125px] h-[155px] bg-gray-100 rounded-lg overflow-hidden border-[3px] border-amber-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)] relative">
            {member.profileImageUrl ? (
              <img src={member.profileImageUrl} alt="Member" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-emerald-800/30 bg-emerald-50">{initials}</div>
            )}
          </div>
          <div className={`mt-4 px-2 py-1.5 text-[9px] font-black uppercase rounded border text-center w-full shadow-sm
            ${isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
            {status}
          </div>
        </div>

        {/* Right Column: Details Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-5 gap-y-3 pt-1">
          <div className="col-span-2 border-b border-gray-200 pb-2 overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">Full Name</span>
            <div className="text-[17px] font-black text-gray-900 uppercase whitespace-nowrap">{name}</div>
          </div>
          <div className="col-span-2 border-b border-gray-200 pb-2 overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">Father's Name</span>
            <div className="text-[14px] font-bold text-gray-800 uppercase whitespace-nowrap">{fatherName}</div>
          </div>
          <div className="overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">CNIC / ID Number</span>
            <div className="text-[13px] font-bold text-gray-800 whitespace-nowrap">{cnic}</div>
          </div>
          <div className="overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">Membership No.</span>
            <div className="text-[13px] font-bold text-gray-800 whitespace-nowrap">{cardNo}</div>
          </div>
          <div className="overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">Phone Number</span>
            <div className="text-[13px] font-bold text-gray-800 whitespace-nowrap">{phone}</div>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <div>
              <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-1">Blood Group</span>
              <div className="text-[14px] font-black text-white bg-red-600 px-2 py-0.5 rounded shadow-sm inline-block">{blood}</div>
            </div>
          </div>
          <div className="col-span-2 mt-1 overflow-hidden">
            <span className="block text-[9px] font-bold text-emerald-700 uppercase mb-0.5">Village / Address</span>
            <div className="text-[13px] font-bold text-gray-800 whitespace-nowrap">{village}</div>
          </div>
        </div>
      </div>

      {/* Background Watermark */}
      <div className="absolute right-[-40px] bottom-[30px] opacity-[0.03] pointer-events-none">
        <img src="/zj-logo-emerald.png" alt="Watermark" className="w-[280px] h-[280px] grayscale" />
      </div>

      {/* Footer Strip */}
      <div className="absolute bottom-0 left-0 w-full h-[55px] bg-[#f8fafc] border-t border-gray-200 flex items-center justify-between px-7 z-20">
        <div className="flex gap-8">
          <div>
            <span className="block text-[8px] font-bold text-gray-500 uppercase mb-0.5">Issue Date</span>
            <div className="text-[11px] font-bold text-gray-900">{issueDate}</div>
          </div>
          <div>
            <span className="block text-[8px] font-bold text-gray-500 uppercase mb-0.5">Expiry Date</span>
            <div className="text-[11px] font-bold text-gray-900">{expiryDate}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-black text-emerald-800 uppercase text-right bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-100">
            Private Community<br/>Member ID
          </div>
          <div className="bg-white p-1 border border-gray-200 rounded shadow-sm flex items-center justify-center">
            <QRCode value={qrValue} size={36} level="L" />
          </div>
        </div>
      </div>
    </div>
  );

  const CardBack = () => (
    <div id={isPdfMode ? "card-pdf-back" : undefined} className="relative w-[600px] h-[380px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200 font-sans flex flex-col text-gray-900 bg-gradient-to-br from-white to-gray-50 shrink-0">
      {/* Header Strip */}
      <div className="w-full h-[60px] bg-emerald-900 flex items-center justify-center border-b-[4px] border-amber-400">
        <h2 className="text-[18px] font-black text-white uppercase drop-shadow-md" style={{ letterSpacing: '4px' }}>Member Benefits</h2>
      </div>

      {/* Body Content */}
      <div className="flex-1 flex px-8 py-6 gap-6 items-center">
        {/* Left: Benefits Grid */}
        <div className="flex-1 grid grid-cols-2 gap-y-7 gap-x-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <Users size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-900 uppercase">Community<br/>Networking</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <HeartHandshake size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-900 uppercase">Social<br/>Support</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-900 uppercase">Educational<br/>Resources</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <Megaphone size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-black text-gray-900 uppercase">Advocacy &<br/>Welfare</span>
            </div>
          </div>
        </div>

        {/* Right: Divider & QR */}
        <div className="w-px h-[160px] bg-gray-200 shrink-0"></div>
        <div className="shrink-0 flex flex-col items-center w-[130px] justify-center">
          <div className="bg-white p-2.5 border-2 border-emerald-900 rounded-xl shadow-md mb-3">
            <QRCode value={qrValue} size={90} level="M" />
          </div>
          <span className="text-[9px] font-black text-emerald-800 uppercase text-center" style={{ letterSpacing: '2px' }}>Scan For<br/>Verification</span>
        </div>
      </div>

      {/* Background Watermark */}
      <div className="absolute left-[30px] top-[100px] opacity-[0.02] pointer-events-none">
        <img src="/zj-logo-emerald.png" alt="Watermark" className="w-[200px] h-[200px] grayscale" />
      </div>

      {/* Info Bar */}
      <div className="px-8 py-3 bg-gray-100 flex justify-between items-center border-t border-gray-200 z-10">
        <div className="flex items-center gap-2 text-gray-700">
          <Globe2 size={15} className="text-emerald-700" />
          <span className="text-[11px] font-bold">jawkhela-youth.vercel.app</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Phone size={15} className="text-emerald-700" />
          <span className="text-[11px] font-bold">Helpline: +92 300 123 4567</span>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="h-[40px] bg-emerald-950 flex items-center justify-center z-10">
        <div className="flex items-center gap-4 text-amber-400">
          <div className="w-12 h-px bg-amber-400/50"></div>
          <span className="text-[10px] font-black uppercase" style={{ letterSpacing: '5px' }}>Unity · Respect · Culture · Service</span>
          <div className="w-12 h-px bg-amber-400/50"></div>
        </div>
      </div>
    </div>
  );

  if (isPdfMode) {
    return side === 'front' ? <CardFront /> : <CardBack />;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div style={{ containerType: 'inline-size', width: '100%', maxWidth: '600px' }}>
        {/* Aspect ratio box (600x380 = 63.33%) */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '63.33%' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '600px', height: '380px', transform: 'scale(calc(100cqi / 600))', transformOrigin: 'top left' }}>
            {!showBack ? <CardFront /> : <CardBack />}
          </div>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => setShowBack(!showBack)}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-full transition-colors text-sm shadow-sm border border-gray-200"
      >
        <Repeat size={16} /> {showBack ? 'View Front Side' : 'View Back Side'}
      </button>
    </div>
  );
}

/**
 * Helper to generate and download a 2-page PDF of the Membership Card.
 * It renders the card in an offscreen container, captures it, and saves the PDF.
 */
export const generateMembershipCardPDF = async (member: MembershipCardData) => {
  let pdfMember = { ...member };
  if (member.profileImageUrl) {
    try {
      const response = await fetch(member.profileImageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`Image request failed: ${response.status}`);
      const blob = await response.blob();
      pdfMember.profileImageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Member photo could not be embedded in PDF; using initials instead.', error);
      pdfMember.profileImageUrl = undefined;
    }
  }
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '1000px'; 
  container.style.height = '1000px';
  document.body.appendChild(container);

  const root = createRoot(container);
  
  await new Promise<void>((resolve) => {
    root.render(
      <div id="pdf-card-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
        <MembershipCard member={pdfMember} isPdfMode={true} side="front" />
        <MembershipCard member={pdfMember} isPdfMode={true} side="back" />
      </div>
    );
    // Give fonts and same-origin images time to load before snapshotting.
    setTimeout(resolve, 1500);
  });

  try {
    const frontEl = document.getElementById('card-pdf-front');
    const backEl = document.getElementById('card-pdf-back');
    
    if (!frontEl || !backEl) throw new Error("Card elements not found");

    const canvasOptions = { scale: 2, useCORS: true, allowTaint: false, imageTimeout: 10000, backgroundColor: '#ffffff', logging: false } as const;
    const waitForImages = async (element: HTMLElement) => {
      await Promise.all(Array.from(element.querySelectorAll('img')).map(async (image) => {
        if (image.complete && image.naturalWidth > 0) {
          try { await image.decode(); } catch { /* browser already decoded it */ }
          return;
        }
        await new Promise<void>((resolve) => {
          const finish = () => { image.removeEventListener('load', finish); image.removeEventListener('error', finish); resolve(); };
          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
          window.setTimeout(finish, 10000);
        });
      }));
    };
    const capture = async (element: HTMLElement) => {
      await waitForImages(element);
      return html2canvas(element, canvasOptions);
    };
    const canvasFront = await capture(frontEl);
    const canvasBack = await capture(backEl);

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [600, 380] });
    pdf.addImage(canvasFront.toDataURL('image/png'), 'PNG', 0, 0, 600, 380);
    pdf.addPage([600, 380], 'landscape');
    pdf.addImage(canvasBack.toDataURL('image/png'), 'PNG', 0, 0, 600, 380);
    
    const safeName = (member.fullName || member.name || 'Member').replace(/\s+/g, '_');
    pdf.save(`ZJ_Membership_Card_${safeName}.pdf`);
  } catch (e) {
    console.error(e);
    try {
      const name = member.fullName || member.name || 'COMMUNITY MEMBER';
      const cardNo = member.cardNumber || member.membershipNumber || `ZJ-${new Date().getFullYear()}-0001`;
      const blood = member.bloodGroup || member.bloodType || '—';
      const village = member.village || member.address || '—';
      const directPdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [600, 380] });
      const drawPage = (back = false) => {
        directPdf.setFillColor(255, 255, 255); directPdf.rect(0, 0, 600, 380, 'F');
        directPdf.setFillColor(6, 62, 43); directPdf.rect(0, 0, 600, back ? 58 : 88, 'F');
        directPdf.setDrawColor(215, 182, 76); directPdf.setLineWidth(3); directPdf.line(0, back ? 58 : 88, 600, back ? 58 : 88);
        directPdf.setTextColor(255, 255, 255); directPdf.setFont('helvetica', 'bold'); directPdf.setFontSize(22); directPdf.text('Zwanan Jawkhela', 28, 35);
        directPdf.setFontSize(10); directPdf.text('Youth Welfare Community', 30, 55);
        if (back) {
          directPdf.setTextColor(7, 92, 65); directPdf.setFontSize(22); directPdf.text('MEMBER BENEFITS', 210, 110);
          directPdf.setFontSize(14); directPdf.text('COMMUNITY NETWORKING', 55, 165); directPdf.text('SOCIAL SUPPORT', 55, 205);
          directPdf.text('EDUCATIONAL RESOURCES', 330, 165); directPdf.text('ADVOCACY & WELFARE', 330, 205);
          directPdf.setTextColor(6, 62, 43); directPdf.setFontSize(13); directPdf.text('Website: jawkhela-youth.vercel.app', 55, 285); directPdf.text('Helpline: +92 300 123 4567', 55, 310);
          directPdf.setFillColor(6, 62, 43); directPdf.rect(0, 340, 600, 40, 'F'); directPdf.setTextColor(215, 182, 76); directPdf.setFontSize(14); directPdf.text('UNITY  •  RESPECT  •  CULTURE  •  SERVICE', 145, 365);
        } else {
          if (pdfMember.profileImageUrl?.startsWith('data:image/')) {
            try {
              const imageFormat = pdfMember.profileImageUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
              directPdf.addImage(pdfMember.profileImageUrl, imageFormat, 45, 112, 115, 145);
            } catch (imageError) { console.warn('Direct PDF photo insertion failed', imageError); }
          }
          directPdf.setTextColor(7, 92, 65); directPdf.setFontSize(26); directPdf.text('COMMUNITY MEMBER CARD', 190, 125);
          directPdf.setFontSize(18); directPdf.text(name, 190, 175); directPdf.setTextColor(164, 121, 19); directPdf.setFontSize(15); directPdf.text(cardNo, 190, 200);
          directPdf.setTextColor(65, 84, 74); directPdf.setFontSize(12); directPdf.text(`Father's Name: ${member.fatherName || 'Not provided'}`, 190, 235); directPdf.text(`CNIC / ID: ${member.cnic || 'Not provided'}`, 190, 260); directPdf.text(`Blood Group: ${blood}`, 190, 285); directPdf.text(`Village: ${village}`, 390, 285);
          directPdf.setFillColor(6, 62, 43); directPdf.rect(0, 330, 600, 50, 'F'); directPdf.setTextColor(255, 255, 255); directPdf.setFontSize(18); directPdf.text(String(member.status || 'MEMBERSHIP APPLICANT').toUpperCase(), 190, 360);
        }
      };
      drawPage(false); directPdf.addPage([600, 380], 'landscape'); drawPage(true);
      const safeName = name.replace(/\s+/g, '_'); directPdf.save(`ZJ_Membership_Card_${safeName}.pdf`);
    } catch (fallbackError) {
      console.error('Direct PDF fallback failed', fallbackError);
      alert('PDF could not be generated. Please try again; the member data was not changed.');
    }
  } finally {
    root.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
