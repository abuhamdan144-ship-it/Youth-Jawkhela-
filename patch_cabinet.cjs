const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Update state
code = code.replace(
  /const \[newCabinetForm, setNewCabinetForm\] = useState\(\{ userId: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' \}\);/,
  "const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });"
);

// 2. Update handleAddCabinet
const oldHandleAddCabinet = `  const handleAddCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userObj = activeMembers.find(m => m.id === newCabinetForm.userId);
      if (!userObj) return alert("Please select a valid member");
      let profileImage = userObj.profileImage || userObj.profileImageUrl || '';
      if (cabinetImage) {
        const imageRef = ref(storage, \`cabinet/\${Date.now()}-\${cabinetImage.name}\`);
        await uploadBytes(imageRef, cabinetImage);
        profileImage = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, 'cabinet'), {
        userId: userObj.id,
        name: userObj.fullName || userObj.name || '',
        profileImage,
        position: newCabinetForm.position,
        tenure: { startDate: newCabinetForm.startDate, endDate: newCabinetForm.endDate },
        responsibilities: newCabinetForm.responsibilities,
        createdAt: serverTimestamp()
      });
      alert('Cabinet member added');
      setNewCabinetForm({ userId: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });
      setCabinetImage(null);
      fetchCabinet();
    } catch (error) {
      console.error(error);
    }
  };`;

const newHandleAddCabinet = `  const handleAddCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newCabinetForm.name.trim()) return alert("Please enter a name");
      let profileImage = '';
      if (cabinetImage) {
        const imageRef = ref(storage, \`cabinet/\${Date.now()}-\${cabinetImage.name}\`);
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
  };`;

code = code.replace(oldHandleAddCabinet, newHandleAddCabinet);

// 3. Update Form UI
const oldFormGroup = `                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Active Member</label>
                    <select required value={newCabinetForm.userId} onChange={(e) => setNewCabinetForm({...newCabinetForm, userId: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">-- Select Member --</option>
                      {activeMembers.map(m => <option key={m.id} value={m.id}>{m.fullName || m.name} ({m.cardNumber || m.membershipNumber || 'No ID'})</option>)}
                    </select>
                  </div>`;

const newFormGroup = `                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cabinet Member Name</label>
                    <input required type="text" placeholder="Full Name" value={newCabinetForm.name} onChange={(e) => setNewCabinetForm({...newCabinetForm, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>`;

code = code.replace(oldFormGroup, newFormGroup);

fs.writeFileSync('src/components/Admin.tsx', code);
