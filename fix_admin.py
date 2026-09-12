import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# Fix the component name
code = code.replace("export function Admin() {", "export function AdminInner() {")

# Remove remaining useState for collections
code = re.sub(r'const \[donations, setDonations\] = useState<any\[\]>\(\[\]\);\n', '', code)
code = re.sub(r'const \[overseasPending, setOverseasPending\] = useState<any\[\]>\(\[\]\);\n', '', code)
code = re.sub(r'const \[activeMembers, setActiveMembers\] = useState<any\[\]>\(\[\]\);\n', '', code)

# Let's also check if there are other usages of `set*` that might break
code = code.replace("setCabinetMembers(cabList);", "")
code = code.replace("setMeetings(meetList);", "")

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
