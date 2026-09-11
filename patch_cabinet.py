with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# 1. Update State
code = code.replace(
    "const [newCabinetForm, setNewCabinetForm] = useState({ userId: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });",
    "const [newCabinetForm, setNewCabinetForm] = useState({ name: '', position: 'General Member', startDate: '', endDate: '', responsibilities: '' });"
)

# 2. Update handler
start_marker = "const handleAddCabinet = async (e: React.FormEvent) => {"
end_marker = "  const fetchDonations = async () => {"

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
  };

"""

start_idx = code.find(start_marker)
if start_idx != -1:
    end_idx = code.find(end_marker, start_idx)
    if end_idx != -1:
        # Check if there is a '  const handleAddMember = async (e: React.FormEvent) => {' between start and end
        # Wait, fetchDonations is before handleAddMember. Where is handleAddCabinet?
        pass

