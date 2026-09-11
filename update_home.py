import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_state = "  const [news, setNews] = useState<RecordItem[]>([]); const [cabinet, setCabinet] = useState<RecordItem[]>([]); const [ads, setAds] = useState<RecordItem[]>([]);\n  useEffect(() => { readCollection('announcements').then(setNews); readCollection('cabinet').then((x) => setCabinet(x.length ? x : fallbackCabinet)); readCollection('paidAds').then(setAds); }, []);\n  const marquee = [...cabinet, ...cabinet];"

new_state = "  const [news, setNews] = useState<RecordItem[]>([]); const [overseas, setOverseas] = useState<RecordItem[]>([]); const [ads, setAds] = useState<RecordItem[]>([]);\n  useEffect(() => { readCollection('announcements').then(setNews); readCollection('overseasRegistration').then((x) => setOverseas(x.length ? x : [])); readCollection('paidAds').then(setAds); }, []);\n  const marquee = [...overseas, ...overseas];"

code = code.replace(old_state, new_state)

old_section = """<section className="cabinet-strip"><div className="container"><div className="section-heading compact"><div><span className="eyebrow">Leadership in motion</span><h2>Cabinet members</h2></div><Link to="/cabinet" className="text-link">View all <ArrowRight size={16} /></Link></div><div className="cabinet-marquee" aria-label="Cabinet members flowing from right to left">{marquee.map((m, i) => <div className="cabinet-card" key={`${m.id || m.name}-${i}`}><div className="avatar">{m.profileImage ? <img src={m.profileImage} alt={`${text(m, 'name', 'fullName') || 'Cabinet member'} photo`} /> : (m.name || 'ZJ').slice(0, 2).toUpperCase()}</div><div><b>{text(m, 'name', 'fullName') || 'Community member'}</b><small>{text(m, 'position', 'role') || 'Cabinet member'}</small></div></div>)}</div></div></section>"""

new_section = """<section className="cabinet-strip"><div className="container"><div className="section-heading compact"><div><span className="eyebrow">Global network</span><h2>Overseas Pakistanis</h2></div><Link to="/overseas-registration" className="text-link">Register now <ArrowRight size={16} /></Link></div><div className="cabinet-marquee" aria-label="Overseas members flowing from right to left">{marquee.map((m, i) => <div className="cabinet-card" key={`${m.id || m.name}-${i}`}><div className="avatar">{(text(m, 'fullName', 'name') || 'OP').slice(0, 2).toUpperCase()}</div><div><b>{text(m, 'fullName', 'name') || 'Overseas Member'}</b><small>{text(m, 'currentCountry') || 'Global'}</small></div></div>)}</div></div></section>"""

code = code.replace(old_section, new_section)

with open('src/App.tsx', 'w') as f:
    f.write(code)

