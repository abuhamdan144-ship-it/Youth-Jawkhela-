const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Add states
const statesToAdd = `
  const [newMemberForm, setNewMemberForm] = useState({ fullName: '', phone: '', cnic: '', bloodGroup: 'O+', village: 'Jawkhela' });
  const [newDonationForm, setNewDonationForm] = useState({ donorName: '', amount: '', date: '', purpose: '' });
  const [newBloodForm, setNewBloodForm] = useState({ patientName: '', bloodGroup: 'A+', hospital: '', contactNumber: '', urgency: 'High' });
  const [newOverseasForm, setNewOverseasForm] = useState({ fullName: '', currentCountry: '', currentCity: '', phone: '', homeVillage: '' });
  const [donations, setDonations] = useState<any[]>([]);
`;
code = code.replace(/const \[adImage, setAdImage\] = useState<File \| null>\(null\);/, `const [adImage, setAdImage] = useState<File | null>(null);\n${statesToAdd}`);

// 2. Add handlers
const handlersToAdd = `
  const fetchDonations = async () => {
    try {
      const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setDonations(list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'memberships'), {
        ...newMemberForm,
        name: newMemberForm.fullName,
        status: 'Active',
        membershipTier: 'standard',
        createdAt: serverTimestamp()
      });
      setNewMemberForm({ fullName: '', phone: '', cnic: '', bloodGroup: 'O+', village: 'Jawkhela' });
      fetchMembers();
      alert('Member added manually.');
    } catch(e) { console.error(e); }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'donations'), {
        ...newDonationForm,
        createdAt: serverTimestamp()
      });
      setNewDonationForm({ donorName: '', amount: '', date: '', purpose: '' });
      fetchDonations();
      alert('Donation record saved.');
    } catch(e) { console.error(e); }
  };

  const handleAddBloodRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'bloodDonation'), {
        ...newBloodForm,
        status: 'Active',
        createdAt: serverTimestamp()
      });
      setNewBloodForm({ patientName: '', bloodGroup: 'A+', hospital: '', contactNumber: '', urgency: 'High' });
      fetchAdsAndBlood();
      alert('Blood request submitted.');
    } catch(e) { console.error(e); }
  };

  const handleAddOverseas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'overseasRegistration'), {
        ...newOverseasForm,
        status: 'Active',
        createdAt: serverTimestamp()
      });
      setNewOverseasForm({ fullName: '', currentCountry: '', currentCity: '', phone: '', homeVillage: '' });
      fetchAdsAndBlood();
      alert('Overseas record saved.');
    } catch(e) { console.error(e); }
  };
`;
code = code.replace(/const handleAddAd = async/, `${handlersToAdd}\n  const handleAddAd = async`);

// 3. Inject fetchDonations into useEffect
code = code.replace(/fetchAdsAndBlood\(\);/, `fetchAdsAndBlood();\n        fetchDonations();`);

fs.writeFileSync('src/components/Admin.tsx', code);
