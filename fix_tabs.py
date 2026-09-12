import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('<main className="flex-1 min-w-0 overflow-auto p-4 sm:p-8">')
end_idx = code.find('</main>', start_idx) + len('</main>')

new_main = """<main className="flex-1 min-w-0 overflow-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-2">Pending Approvals</span>
                  <span className="text-4xl font-bold text-gray-900">{pendingMembers.length}</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-2">Active Members</span>
                  <span className="text-4xl font-bold text-gray-900">{activeMembers.length}</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                  <span className="text-sm font-medium text-gray-500 mb-2">Overseas Pakistanis</span>
                  <span className="text-4xl font-bold text-gray-900">{overseas.length}</span>
                </div>
              </div>
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Quick actions</span>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">Manage the community</h2>
                  </div>
                  <p className="max-w-md text-sm text-gray-500">Jump directly to the areas you update most often.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <MetalButton preset="chromatic" size="md" onClick={() => setActiveTab('cabinet')} className="bg-emerald-50 px-5">
                    <Sparkles size={16} /> Add cabinet member
                  </MetalButton>
                  <MetalButton preset="silver" size="md" onClick={() => setActiveTab('meetings')} className="bg-slate-100 px-5">
                    View meetings <ArrowUpRight size={16} />
                  </MetalButton>
                  <MetalButton preset="gold" size="md" onClick={() => setActiveTab('ads')} className="bg-amber-50 px-5">
                    Publish paid ad <ArrowUpRight size={16} />
                  </MetalButton>
                </div>
              </section>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Overview</h3>
                </div>
                <div className="p-6 text-gray-500 text-sm">
                  Select a category from the sidebar to manage specific records.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Member Manually</h3>
                <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required value={newMemberForm.fullName} onChange={e => setNewMemberForm({...newMemberForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.cnic} onChange={e => setNewMemberForm({...newMemberForm, cnic: e.target.value})} placeholder="CNIC Number" className="border rounded-lg px-4 py-2" />
                  <input required value={newMemberForm.phone} onChange={e => setNewMemberForm({...newMemberForm, phone: e.target.value})} placeholder="Phone Number" className="border rounded-lg px-4 py-2" />
                  <select value={newMemberForm.bloodGroup} onChange={e => setNewMemberForm({...newMemberForm, bloodGroup: e.target.value})} className="border rounded-lg px-4 py-2 bg-white">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <input required value={newMemberForm.village} onChange={e => setNewMemberForm({...newMemberForm, village: e.target.value})} placeholder="Village / Area" className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <button type="submit" className="md:col-span-2 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Add Member</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Pending Memberships</h3>
                </div>
                <AdminDataTable 
                  collectionName="memberships" 
                  data={pendingMembers} 
                  titleField="fullName"
                  columns={[
                    { header: "Name & CNIC", cell: (item) => (<div><div className="font-medium text-gray-900">{item.fullName || item.name}</div><div className="text-sm font-mono text-gray-500">{item.cnic}</div></div>), sortable: true, accessorKey: "fullName" },
                    { header: "Contact", cell: (item) => (<div><div className="text-gray-900">{item.phone}</div><div className="text-sm text-gray-500">Blood: <span className="font-bold text-red-600">{item.bloodGroup}</span></div></div>) },
                    { header: "Village", accessorKey: "village", sortable: true },
                    { header: "Tier", accessorKey: "membershipTier", sortable: true },
                  ]}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Active Memberships</h3>
                </div>
                <AdminDataTable 
                  collectionName="memberships" 
                  data={activeMembers} 
                  titleField="fullName"
                  columns={[
                    { header: "Name & CNIC", cell: (item) => (<div><div className="font-medium text-gray-900">{item.fullName || item.name}</div><div className="text-sm font-mono text-gray-500">{item.cnic}</div></div>), sortable: true, accessorKey: "fullName" },
                    { header: "Contact", cell: (item) => (<div><div className="text-gray-900">{item.phone}</div><div className="text-sm text-gray-500">Blood: <span className="font-bold text-red-600">{item.bloodGroup}</span></div></div>) },
                    { header: "Village", accessorKey: "village", sortable: true },
                    { header: "Tier", accessorKey: "membershipTier", sortable: true },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Record New Donation</h3>
                <form onSubmit={handleAddDonation} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required value={newDonationForm.donorName} onChange={e => setNewDonationForm({...newDonationForm, donorName: e.target.value})} placeholder="Donor Name" className="border rounded-lg px-4 py-2" />
                  <input required type="number" value={newDonationForm.amount} onChange={e => setNewDonationForm({...newDonationForm, amount: e.target.value})} placeholder="Amount (PKR)" className="border rounded-lg px-4 py-2" />
                  <input required type="date" value={newDonationForm.date} onChange={e => setNewDonationForm({...newDonationForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required value={newDonationForm.purpose} onChange={e => setNewDonationForm({...newDonationForm, purpose: e.target.value})} placeholder="Purpose / Campaign" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="md:col-span-4 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Record Donation</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Donation Records</h3>
                </div>
                <AdminDataTable 
                  collectionName="donations" 
                  data={donations} 
                  titleField="donorName"
                  columns={[
                    { header: "Donor", accessorKey: "donorName", sortable: true },
                    { header: "Amount", cell: (item) => <span className="font-bold text-emerald-700">Rs {item.amount?.toLocaleString()}</span>, sortable: true, accessorKey: "amount" },
                    { header: "Date", accessorKey: "date", sortable: true },
                    { header: "Purpose", accessorKey: "purpose", sortable: true },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'blood' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Blood Request</h3>
                <form onSubmit={handleAddBloodRequest} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required value={newBloodForm.patientName} onChange={e => setNewBloodForm({...newBloodForm, patientName: e.target.value})} placeholder="Patient Name" className="border rounded-lg px-4 py-2" />
                  <select required value={newBloodForm.bloodGroup} onChange={e => setNewBloodForm({...newBloodForm, bloodGroup: e.target.value})} className="border rounded-lg px-4 py-2 bg-white">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <input required value={newBloodForm.hospital} onChange={e => setNewBloodForm({...newBloodForm, hospital: e.target.value})} placeholder="Hospital Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newBloodForm.contactNumber} onChange={e => setNewBloodForm({...newBloodForm, contactNumber: e.target.value})} placeholder="Contact Phone" className="border rounded-lg px-4 py-2" />
                  <select required value={newBloodForm.urgency} onChange={e => setNewBloodForm({...newBloodForm, urgency: e.target.value})} className="border rounded-lg px-4 py-2 bg-white md:col-span-2">
                    <option value="High">High Urgency</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button type="submit" className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">Post Request</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Blood Requests</h3>
                </div>
                <AdminDataTable 
                  collectionName="bloodDonation" 
                  data={bloodRequests} 
                  titleField="patientName"
                  columns={[
                    { header: "Patient & Group", cell: (item) => (<div><div className="font-medium text-gray-900">{item.patientName}</div><div className="text-sm font-bold text-red-600">{item.bloodGroup}</div></div>), sortable: true, accessorKey: "patientName" },
                    { header: "Hospital & Contact", cell: (item) => (<div><div className="text-gray-900">{item.hospital}</div><div className="text-sm text-gray-500">{item.contact || item.contactNumber}</div></div>), sortable: true, accessorKey: "hospital" },
                    { header: "Urgency", cell: (item) => <span className={`px-2 py-1 text-xs font-bold rounded ${item.urgency === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.urgency}</span>, sortable: true, accessorKey: "urgency" },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'overseas' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Overseas Member</h3>
                <form onSubmit={handleAddOverseas} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input required value={newOverseasForm.fullName} onChange={e => setNewOverseasForm({...newOverseasForm, fullName: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCountry} onChange={e => setNewOverseasForm({...newOverseasForm, currentCountry: e.target.value})} placeholder="Current Country" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.currentCity} onChange={e => setNewOverseasForm({...newOverseasForm, currentCity: e.target.value})} placeholder="Current City" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.phone} onChange={e => setNewOverseasForm({...newOverseasForm, phone: e.target.value})} placeholder="Phone Number" className="border rounded-lg px-4 py-2" />
                  <input required value={newOverseasForm.homeVillage} onChange={e => setNewOverseasForm({...newOverseasForm, homeVillage: e.target.value})} placeholder="Home Village" className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <button type="submit" className="md:col-span-3 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Add Overseas Record</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Overseas Registrations</h3>
                </div>
                <AdminDataTable 
                  collectionName="overseasRegistration" 
                  data={overseas} 
                  titleField="fullName"
                  columns={[
                    { header: "Name & CNIC", cell: (item) => (<div><div className="font-medium text-gray-900">{item.fullName || item['Full name'] || item.name}</div><div className="text-sm font-mono text-gray-500">{item['Passport / CNIC'] || item.passport || item.cnic || '-'}</div></div>), sortable: true, accessorKey: "fullName" },
                    { header: "Location", cell: (item) => (<div><div className="text-gray-900">{item.currentCountry || item['Current country']}</div><div className="text-sm text-gray-500">{item.currentCity || item['Current city']}</div></div>), sortable: true, accessorKey: "currentCountry" },
                    { header: "Village & Contact", cell: (item) => (<div><div className="text-gray-900">{item.homeVillage || item['Home village']}</div><div className="text-sm text-gray-500">{item.phone || item['Phone']}</div></div>) },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'cabinet' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign Cabinet Member</h3>
                <form onSubmit={handleAddCabinet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required value={newCabinetForm.name} onChange={e => setNewCabinetForm({...newCabinetForm, name: e.target.value})} placeholder="Full Name" className="border rounded-lg px-4 py-2" />
                  <select required value={newCabinetForm.position} onChange={e => setNewCabinetForm({...newCabinetForm, position: e.target.value})} className="border rounded-lg px-4 py-2 bg-white">
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Finance Secretary">Finance Secretary</option>
                  </select>
                  <input type="date" required value={newCabinetForm.startDate} onChange={e => setNewCabinetForm({...newCabinetForm, startDate: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input type="date" required value={newCabinetForm.endDate} onChange={e => setNewCabinetForm({...newCabinetForm, endDate: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input type="file" accept="image/*" onChange={e => setCabinetImage(e.target.files?.[0] || null)} className="border rounded-lg px-4 py-2" />
                  <input required value={newCabinetForm.responsibilities} onChange={e => setNewCabinetForm({...newCabinetForm, responsibilities: e.target.value})} placeholder="Key Responsibilities" className="border rounded-lg px-4 py-2" />
                  <button type="submit" className="md:col-span-2 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Add Cabinet Member</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Current Cabinet</h3>
                </div>
                <AdminDataTable 
                  collectionName="cabinet" 
                  data={cabinetMembers} 
                  titleField="name"
                  columns={[
                    { header: "Member", cell: (item) => (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {item.profileImage ? <img src={item.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{item.name?.slice(0,2)}</div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm font-bold text-emerald-700">{item.position}</div>
                        </div>
                      </div>
                    ), sortable: true, accessorKey: "name" },
                    { header: "Tenure", cell: (item) => <div className="text-sm text-gray-500">{new Date(item.startDate || item.tenure?.startDate).toLocaleDateString()} - {new Date(item.endDate || item.tenure?.endDate).toLocaleDateString()}</div> },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'meetings' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Meeting</h3>
                <form onSubmit={handleAddMeeting} className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" required value={newMeetingForm.date} onChange={e => setNewMeetingForm({...newMeetingForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                    <input type="text" required placeholder="Location" value={newMeetingForm.location} onChange={e => setNewMeetingForm({...newMeetingForm, location: e.target.value})} className="border rounded-lg px-4 py-2" />
                  </div>
                  <textarea required placeholder="Meeting Summary" value={newMeetingForm.summary} onChange={e => setNewMeetingForm({...newMeetingForm, summary: e.target.value})} className="border rounded-lg px-4 py-2 min-h-[100px]"></textarea>
                  <button type="submit" className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Record Meeting</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Meeting Logs</h3>
                </div>
                <AdminDataTable 
                  collectionName="cabinetMeetings" 
                  data={meetings} 
                  titleField="summary"
                  columns={[
                    { header: "Date", accessorKey: "date", sortable: true },
                    { header: "Location", accessorKey: "location", sortable: true },
                    { header: "Summary", cell: (item) => <div className="text-sm text-gray-600 truncate max-w-[300px]">{item.summary}</div> },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Publish Announcement</h3>
                <form onSubmit={handleAddNews} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input required placeholder="Title" value={newNewsForm.title} onChange={e => setNewNewsForm({...newNewsForm, title: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <select required value={newNewsForm.category} onChange={e => setNewNewsForm({...newNewsForm, category: e.target.value})} className="border rounded-lg px-4 py-2 bg-white">
                    <option value="Announcement">Announcement</option>
                    <option value="News">News</option>
                  </select>
                  <input type="date" required value={newNewsForm.date} onChange={e => setNewNewsForm({...newNewsForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <textarea required placeholder="Content" value={newNewsForm.content} onChange={e => setNewNewsForm({...newNewsForm, content: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-3"></textarea>
                  <button type="submit" className="md:col-span-3 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Publish News</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule Event</h3>
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input required placeholder="Title" value={newEventForm.title} onChange={e => setNewEventForm({...newEventForm, title: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <input type="date" required value={newEventForm.date} onChange={e => setNewEventForm({...newEventForm, date: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input type="time" required value={newEventForm.time} onChange={e => setNewEventForm({...newEventForm, time: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required placeholder="Location" value={newEventForm.location} onChange={e => setNewEventForm({...newEventForm, location: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-2" />
                  <textarea required placeholder="Description" value={newEventForm.description} onChange={e => setNewEventForm({...newEventForm, description: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-4"></textarea>
                  <button type="submit" className="md:col-span-4 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Schedule Event</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">News & Announcements</h3>
                </div>
                <AdminDataTable 
                  collectionName="announcements" 
                  data={news} 
                  titleField="title"
                  columns={[
                    { header: "Title", cell: (item) => <div className="font-medium text-gray-900">{item.title}</div>, sortable: true, accessorKey: "title" },
                    { header: "Category", cell: (item) => <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{item.category}</span>, sortable: true, accessorKey: "category" },
                    { header: "Date", accessorKey: "date", sortable: true },
                  ]}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
                </div>
                <AdminDataTable 
                  collectionName="events" 
                  data={events} 
                  titleField="title"
                  columns={[
                    { header: "Title", cell: (item) => <div className="font-medium text-gray-900">{item.title}</div>, sortable: true, accessorKey: "title" },
                    { header: "Date & Time", cell: (item) => <div>{item.date} {item.time}</div>, sortable: true, accessorKey: "date" },
                    { header: "Location", accessorKey: "location", sortable: true },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Paid Ad</h3>
                <form onSubmit={handleAddAd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Ad Title" value={newAdForm.title} onChange={e => setNewAdForm({...newAdForm, title: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required placeholder="Business Name" value={newAdForm.businessName} onChange={e => setNewAdForm({...newAdForm, businessName: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required placeholder="CTA Text" value={newAdForm.cta} onChange={e => setNewAdForm({...newAdForm, cta: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input required type="number" placeholder="Duration (Days)" value={newAdForm.durationDays} onChange={e => setNewAdForm({...newAdForm, durationDays: e.target.value})} className="border rounded-lg px-4 py-2" />
                  <input type="file" accept="image/*" onChange={e => setAdImage(e.target.files?.[0] || null)} className="border rounded-lg px-4 py-2" />
                  <textarea required placeholder="Description" value={newAdForm.description} onChange={e => setNewAdForm({...newAdForm, description: e.target.value})} className="border rounded-lg px-4 py-2 md:col-span-2"></textarea>
                  <button type="submit" className="md:col-span-2 bg-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">Publish Ad</button>
                </form>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Active Advertisements</h3>
                </div>
                <AdminDataTable 
                  collectionName="paidAds" 
                  data={ads} 
                  titleField="title"
                  columns={[
                    { header: "Business", cell: (item) => (
                      <div className="flex items-center gap-3">
                        {item.imageUrl && <img src={item.imageUrl} className="w-12 h-12 rounded object-cover" />}
                        <div>
                          <div className="font-medium text-gray-900">{item.businessName}</div>
                          <div className="text-xs text-gray-500">{item.title}</div>
                        </div>
                      </div>
                    ), sortable: true, accessorKey: "businessName" },
                    { header: "Duration", cell: (item) => <div>{item.durationDays} Days</div> },
                    { header: "Expires", cell: (item) => <div className="text-sm text-gray-500">{item.expiresAt?.toDate ? item.expiresAt.toDate().toLocaleDateString() : 'N/A'}</div> },
                  ]}
                />
              </div>
            </div>
          )}
        </main>"""

code = code[:start_idx] + new_main + code[end_idx:]

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

