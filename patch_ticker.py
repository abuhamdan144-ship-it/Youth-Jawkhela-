import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

start_marker = "function Ticker() {"
end_marker = "function Site() {"

start_idx = code.find(start_marker)
end_idx = code.find(end_marker, start_idx)

new_ticker = """function Ticker() {
  const [items, setItems] = useState<RecordItem[]>([]);
  
  useEffect(() => {
    readCollection('announcements').then(setItems);
  }, []);

  if (!items.length) return null;
  
  const isUrdu = (str: string) => /[\\u0600-\\u06FF]/.test(str);
  
  const urduItems = items.filter(item => isUrdu(text(item, 'title', 'message')) || text(item, 'category') === 'Takaar');
  const englishItems = items.filter(item => !isUrdu(text(item, 'title', 'message')) && text(item, 'category') !== 'Takaar');

  return (
    <div className="glass-pipe" style={{ flexDirection: 'column', padding: 0 }}>
      {urduItems.length > 0 && (
        <div style={{ width: '100%', overflow: 'hidden', padding: '8px 0', borderBottom: englishItems.length ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
           <div className="ticker-track reverse">
             {(() => {
               const trackText = urduItems.slice(0, 5).map(item => text(item, 'title', 'message')).join('  ✦  ');
               return (
                 <>
                   <span dir="rtl"><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                   <span dir="rtl"><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                   <span dir="rtl"><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                 </>
               )
             })()}
           </div>
        </div>
      )}
      {englishItems.length > 0 && (
        <div style={{ width: '100%', overflow: 'hidden', padding: '8px 0' }}>
           <div className="ticker-track">
             {(() => {
               const trackText = englishItems.slice(0, 5).map(item => text(item, 'title', 'message')).join('  ✦  ');
               return (
                 <>
                   <span><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                   <span><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                   <span><Megaphone size={14} className="ticker-icon" /> {trackText}</span>
                 </>
               )
             })()}
           </div>
        </div>
      )}
    </div>
  );
}

"""

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + new_ticker + code[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(code)
