import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# 1. Update state
code = re.sub(
    r"const \[newCabinetForm, setNewCabinetForm\] = useState\(\{ userId: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' \}\);",
    "const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });",
    code
)

# 2. Update handleAddCabinet
old_handler = r"const handleAddCabinet = async \(e: React\.FormEvent\) => \{.*?catch \(error\) \{\n\s*console\.error\(error\);\n\s*\}\n\s*\};"
new_handler = """const handleAddCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newCabinetForm.name.trim()) return alert("Please enter a name");
      let profileImage = '';
      if (cabinetImage) {
        const imageRef = ref(storage, `cabinet/${Date.now()}-${cabinetImage.name}`);
        await uploadBytes(imageRef, cabinetImage);
        profileImage = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, 'cabinet'), {
        userId: '',
        name: newCabinetForm.name,
        profileImage,
        position: newCabinetForm.position,
        tenure: { startDate: newCabinetForm.startDate, endDate: newCabinetForm.endDate },
        responsibilities: newCabinetForm.responsibilities,
        createdAt: serverTimestamp()
      });
      alert('Cabinet member added');
      setNewCabinetForm({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });
      setCabinetImage(null);
      fetchCabinet();
    } catch (error) {
      console.error(error);
      alert('Failed to add cabinet member');
    }
  };"""

code = re.sub(old_handler, new_handler, code, flags=re.DOTALL)

# 3. Update Form UI
old_form = r"<div>\s*<label className=\"block text-sm font-medium text-gray-700 mb-1\">Select Active Member</label>\s*<select required value=\{newCabinetForm\.userId\}.*?</select>\s*</div>"
new_form = """<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabinet Member Name</label>
                    <input required type="text" placeholder="Full Name" value={newCabinetForm.name} onChange={(e) => setNewCabinetForm({...newCabinetForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>"""

code = re.sub(old_form, new_form, code, flags=re.DOTALL)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
