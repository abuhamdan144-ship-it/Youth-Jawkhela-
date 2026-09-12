import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

overseas_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">\n                <div className="p-6 border-b border-gray-100 flex justify-between items-center">\n                  <h3 className="text-lg font-semibold text-gray-800">Overseas Registrations</h3>')
dashboard_end = code.find('          {activeTab === \'blood\' && (')

overseas_table = """
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
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
"""

if overseas_start != -1 and dashboard_end != -1:
    code = code[:overseas_start] + overseas_table + code[dashboard_end:]

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

