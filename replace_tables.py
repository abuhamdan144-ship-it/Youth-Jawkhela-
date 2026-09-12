import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# 1. Pending Approvals replacement
pending_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">')
# the active members div starts after pending members
active_members_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">')

pending_table = """
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Pending Membership Approvals</h3>
                </div>
                <AdminDataTable 
                  collectionName="memberships" 
                  data={pendingMembers} 
                  titleField="fullName"
                  columns={[
                    { header: "Name & CNIC", cell: (item) => (<div><div className="font-medium text-gray-900">{item.fullName || item.name}</div><div className="text-sm font-mono text-gray-500">{item.cnic}</div></div>), sortable: true, accessorKey: "fullName" },
                    { header: "Contact", cell: (item) => (<div><div className="text-gray-900">{item.phone}</div><div className="text-sm text-gray-500">Blood: <span className="font-bold text-red-600">{item.bloodGroup}</span></div></div>) },
                    { header: "Village", accessorKey: "village", sortable: true },
                  ]}
                />
              </div>
"""

# replace up to the start of active members
if pending_start != -1 and active_members_start != -1:
    code = code[:pending_start] + pending_table + code[active_members_start:]

# 2. Active Directory replacement
active_members_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">')
overseas_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">', active_members_start + 1)
if overseas_start == -1: # Wait, maybe it doesn't have mt-6
    overseas_start = code.find('<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">\n                <div className="p-6 border-b border-gray-100 flex justify-between items-center">\n                  <h3 className="text-lg font-semibold text-gray-800">Overseas Registrations</h3>')

active_table = """
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Active Directory</h3>
                  <button onClick={() => window.print()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"><Printer size={16} /> Print List</button>
                </div>
                <AdminDataTable 
                  collectionName="memberships" 
                  data={activeMembers} 
                  titleField="fullName"
                  columns={[
                    { header: "Name & CNIC", cell: (item) => (<div><div className="font-medium text-gray-900">{item.fullName || item.name}</div><div className="text-sm font-mono text-gray-500">{item.cnic}</div></div>), sortable: true, accessorKey: "fullName" },
                    { header: "Contact", cell: (item) => (<div><div className="text-gray-900">{item.phone}</div><div className="text-sm text-gray-500">Blood: <span className="font-bold text-red-600">{item.bloodGroup}</span></div></div>) },
                    { header: "Village", accessorKey: "village", sortable: true },
                    { header: "Tier", cell: (item) => <span className="capitalize">{item.membershipTier || 'standard'}</span>, sortable: true, accessorKey: "membershipTier" }
                  ]}
                />
              </div>
"""

if active_members_start != -1 and overseas_start != -1:
    code = code[:active_members_start] + active_table + code[overseas_start:]

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

