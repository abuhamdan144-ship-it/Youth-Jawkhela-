import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

blood_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">\n                <div className="p-6 border-b border-gray-100 flex justify-between items-center">\n                  <h3 className="text-lg font-semibold text-gray-800">Blood Donation Requests</h3>')
# Wait, look for bloodRequests table start
if blood_start == -1:
    blood_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">')

blood_end = code.find('          {activeTab === \'donations\' && (')

blood_table = """
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Blood Donation Requests</h3>
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
"""

# wait, we need to preserve the "Create Request" form before the blood requests table
create_blood_form = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">')

if blood_end != -1:
    # let's just replace from the table's start
    table_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">', create_blood_form + 100)
    if table_start != -1:
        code = code[:table_start] + blood_table + code[blood_end:]

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

