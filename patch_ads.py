import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_ads = """function AdsBillboard({ ads }: { ads: RecordItem[] }) { 
  const ad = ads[0] || { title: 'Put your business in front of the community', description: 'Reach local families, overseas Pakistanis, and community supporters with a premium featured placement.', businessName: 'Your business here', cta: 'Book this space' }; 
  return <section className="ads-wrap"><div className="container"><div className="ads-billboard"><div className="ads-light" /><div className="ads-copy"><span className="ads-kicker">Paid community spotlight</span><h2>{text(ad, 'title') || 'Put your business in front of the community'}</h2><p>{text(ad, 'description', 'content') || 'Reach local families and community supporters with a premium featured placement.'}</p><a className="ads-cta" href="mailto:ads@jawkhela-youth.vercel.app">{text(ad, 'cta') || 'Book this space'} <ArrowRight size={16} /></a></div>
    <div className="ads-panel relative overflow-hidden flex-1 min-h-[160px] flex flex-col justify-center border border-white/10 ml-0 lg:ml-8 mt-6 lg:mt-0 rounded-2xl bg-white/5 p-6 backdrop-blur-md">
      {ad.imageUrl && <img src={ad.imageUrl} alt={text(ad, 'businessName')} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />}
      <span className="ads-panel-tag relative z-10 mb-auto w-max text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2 py-1 rounded">FEATURED</span>
      <div className="ads-panel-orb" />
      <b className="relative z-10 text-xl font-black text-white">{text(ad, 'businessName', 'brandName') || 'Your business here'}</b>
      <small className="relative z-10 text-white/70 font-medium mt-1">Grow with Zwanan Jawkhela</small>
    </div>
  </div></div></section>; 
}"""

new_ads = """function AdsBillboard({ ads }: { ads: RecordItem[] }) { 
  const ad = ads[0] || { title: 'Put your business in front of the community', description: 'Reach local families, overseas Pakistanis, and community supporters with a premium featured placement.', businessName: 'Your business here', cta: 'Book this space' }; 
  
  if (ad.imageUrl) {
    return (
      <section className="ads-wrap py-12 bg-white">
        <div className="container">
          <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative group bg-gray-50 flex items-center justify-center min-h-[250px]">
            <span className="absolute top-4 right-4 z-10 text-[10px] font-bold tracking-widest uppercase bg-black/60 text-white px-3 py-1.5 rounded backdrop-blur-md border border-white/10 shadow-lg">SPONSORED</span>
            <img src={ad.imageUrl} alt={text(ad, 'businessName')} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        </div>
      </section>
    );
  }

  return <section className="ads-wrap"><div className="container"><div className="ads-billboard"><div className="ads-light" /><div className="ads-copy"><span className="ads-kicker">Paid community spotlight</span><h2>{text(ad, 'title') || 'Put your business in front of the community'}</h2><p>{text(ad, 'description', 'content') || 'Reach local families and community supporters with a premium featured placement.'}</p><a className="ads-cta" href="mailto:ads@jawkhela-youth.vercel.app">{text(ad, 'cta') || 'Book this space'} <ArrowRight size={16} /></a></div>
    <div className="ads-panel relative overflow-hidden flex-1 min-h-[160px] flex flex-col justify-center border border-white/10 ml-0 lg:ml-8 mt-6 lg:mt-0 rounded-2xl bg-white/5 p-6 backdrop-blur-md">
      <span className="ads-panel-tag relative z-10 mb-auto w-max text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2 py-1 rounded">FEATURED</span>
      <div className="ads-panel-orb" />
      <b className="relative z-10 text-xl font-black text-white">{text(ad, 'businessName', 'brandName') || 'Your business here'}</b>
      <small className="relative z-10 text-white/70 font-medium mt-1">Grow with Zwanan Jawkhela</small>
    </div>
  </div></div></section>; 
}"""

code = code.replace(old_ads, new_ads)

with open('src/App.tsx', 'w') as f:
    f.write(code)
