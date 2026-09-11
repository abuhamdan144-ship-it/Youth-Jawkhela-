const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// 1. Members Form
const membersForm = `
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Member Manually</h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required value={newMemberForm.fullName} onChange={e => setNewMemberForm({...newMemberForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.phone} onChange={e => setNewMemberForm({...newMemberForm, phone: e.target.value})} placeholder="Phone" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.cnic} onChange={e => setNewMemberForm({...newMemberForm, cnic: e.target.value})} placeholder="CNIC" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Member</button>
                </form>
              </div>
`;
code = code.replace(/<div className="space-y-8">/, \`<div className="space-y-8">\${membersForm}\`);

// 2. Donations Form
const donationsTab = `
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Donation</h3>
                <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input required value={newDonationForm.donorName} onChange={e => setNewDonationForm({...newDonationForm, donorName: e.target.value})} placeholder="Donor Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newDonationForm.amount} onChange={e => setNewDonationForm({...newDonationForm, amount: e.target.value})} placeholder="Amount (e.g. 5000 PKR)" className="border rounded-lg px-4 py-2" />
                  <input required type="date" value={newDonationForm.date} onChange={e => setNewDonationForm({...newDonationForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required value={newDonationForm.purpose} onChange={e => setNewDonationForm({...newDonationForm, purpose: e.target.value})} placeholder="Purpose" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Save Donation</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Donations</h3>
                <div className="space-y-3">
                  {donations.length === 0 ? <p className="text-gray-500">No donations recorded yet.</p> : donations.map(d => (
                    <div key={d.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div><b className="block">{d.donorName}</b><span className="text-sm text-gray-500">{d.purpose} · {d.date}</span></div>
                      <span className="font-bold text-green-600">{d.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
`;
code = code.replace(/\{activeTab === 'donations' && \([\s\S]*?Donations management view coming in Phase 2\.[\s\S]*?\)\}/, donationsTab);

// 3. Blood Database Form
const bloodForm = `
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Blood Request</h3>
                <form onSubmit={handleAddBloodRequest} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <input required value={newBloodForm.patientName} onChange={e => setNewBloodForm({...newBloodForm, patientName: e.target.value})} placeholder="Patient Name" className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <select value={newBloodForm.bloodGroup} onChange={e => setNewBloodForm({...newBloodForm, bloodGroup: e.target.value})} className="border rounded-lg px-4 py-2">
                    <option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                    <option value="A-">A-</option><option value="O-">O-</option><option value="B-">B-</option><option value="AB-">AB-</option>
                  </select>
                  <input required value={newBloodForm.hospital} onChange={e => setNewBloodForm({...newBloodForm, hospital: e.target.value})} placeholder="Hospital/City" className="border rounded-lg px-4 py-2" />
                  <input required value={newBloodForm.contactNumber} onChange={e => setNewBloodForm({...newBloodForm, contactNumber: e.target.value})} placeholder="Contact #" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Add Request</button>
                </form>
              </div>
`;
code = code.replace(/(<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-between items-center">)/, \`\${bloodForm}\n              $1\`);

// 4. Overseas Form
const overseasForm = `
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Overseas Member</h3>
                <form onSubmit={handleAddOverseas} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input required value={newOverseasForm.fullName} onChange={e => setNewOverseasForm({...newOverseasForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCountry} onChange={e => setNewOverseasForm({...newOverseasForm, currentCountry: e.target.value})} placeholder="Country" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCity} onChange={e => setNewOverseasForm({...newOverseasForm, currentCity: e.target.value})} placeholder="City" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.phone} onChange={e => setNewOverseasForm({...newOverseasForm, phone: e.target.value})} placeholder="Phone" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">Add Member</button>
                </form>
              </div>
`;
code = code.replace(/(<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">[\s\S]*?<h3 className="text-lg font-semibold text-gray-800">Overseas Registrations<\/h3>)/, \`\${overseasForm}\n              $1\`);

fs.writeFileSync('src/components/Admin.tsx', code);
