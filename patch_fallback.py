import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_fallback = """const fallbackCabinet = [
  { name: 'President', position: 'Community President', responsibilities: 'Guiding the organization with integrity and service.', profileImage: '' },
  { name: 'General Secretary', position: 'General Secretary', responsibilities: 'Coordinating programs, records, and community communication.', profileImage: '' },
  { name: 'Welfare Coordinator', position: 'Welfare Coordinator', responsibilities: 'Connecting families with welfare and emergency support.', profileImage: '' },
  { name: 'Youth Coordinator', position: 'Youth Coordinator', responsibilities: 'Building opportunities for young people to lead and serve.', profileImage: '' },
];"""

new_fallback = """const fallbackCabinet = [
  { name: 'Community President', position: 'President', responsibilities: 'Guiding the organization with integrity and service.', profileImage: '' },
  { name: 'General Secretary', position: 'General Secretary', responsibilities: 'Coordinating programs, records, and community communication.', profileImage: '' },
  { name: 'Finance Secretary', position: 'Finance Secretary', responsibilities: 'Managing financial resources transparently.', profileImage: '' },
  { name: 'Social Media / IT Secretary', position: 'Social Media / IT Secretary', responsibilities: 'Managing online presence and communication.', profileImage: '' },
];"""

code = code.replace(old_fallback, new_fallback)

with open('src/App.tsx', 'w') as f:
    f.write(code)
