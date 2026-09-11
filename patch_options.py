import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# 1. Update state defaults
code = code.replace(
    "const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });",
    "const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'President', startDate: '', endDate: '', responsibilities: '' });"
)
code = code.replace(
    "setNewCabinetForm({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });",
    "setNewCabinetForm({ name: '', position: 'President', startDate: '', endDate: '', responsibilities: '' });"
)

# 2. Update select options
old_select = """<option value="Chairman">Chairman</option>
                      <option value="Vice-Chairman">Vice-Chairman</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="General Member">General Member</option>"""

new_select = """<option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="General Secretary">General Secretary</option>
                      <option value="Finance Secretary">Finance Secretary</option>
                      <option value="Water & Electricity Secretary">Water & Electricity Secretary</option>
                      <option value="Cleaning Secretary">Cleaning Secretary</option>
                      <option value="Education Secretary">Education Secretary</option>
                      <option value="Health Secretary">Health Secretary</option>
                      <option value="Social Media / IT Secretary">Social Media / IT Secretary</option>
                      <option value="Culture Secretary">Culture Secretary</option>"""

code = code.replace(old_select, new_select)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
