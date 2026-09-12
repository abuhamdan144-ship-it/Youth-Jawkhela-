import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

donations_end = code.find('          {activeTab === \'blood\' && (')
# Wait, blood is AFTER donations?
# Let's check the order in Admin.tsx
