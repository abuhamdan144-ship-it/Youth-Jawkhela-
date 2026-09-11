import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_state = "readCollection('overseasRegistration').then((x) => setOverseas(x.length ? x : []));"

new_state = "readCollection('overseasRegistration').then((x) => setOverseas(x.length ? x : fallbackOverseas));"

code = code.replace(old_state, new_state)

old_fallback = "const fallbackCabinet = ["

new_fallback = "const fallbackOverseas = [\n  { fullName: 'Global Supporter', currentCountry: 'United Kingdom' },\n  { fullName: 'Community Member', currentCountry: 'UAE' },\n  { fullName: 'Jawkhela Youth', currentCountry: 'Saudi Arabia' },\n];\nconst fallbackCabinet = ["

code = code.replace(old_fallback, new_fallback)

with open('src/App.tsx', 'w') as f:
    f.write(code)
