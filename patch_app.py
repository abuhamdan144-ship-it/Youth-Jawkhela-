import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_code = r"""<div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>"""

new_code = """<div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: '#55f0be', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><HeartHandshake size={14} /> Official Accounts</div>"""

code = re.sub(old_code, new_code, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)
