import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

code = code.replace("export default function Admin() {", "export function Admin() {")

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

