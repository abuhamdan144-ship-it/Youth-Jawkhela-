import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# activeMembers
old_active = r"""<button onClick=\{\(\) => editMember\(member\)\} className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1.5 rounded text-sm font-medium transition-colors">Edit</button>\s*<button onClick=\{\(\) => deleteMember\(member\.id\)\} className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors">Delete</button>"""
new_active = """<AdminItemActions 
                                  collectionName="memberships" 
                                  item={member} 
                                  onRefresh={fetchMembers} 
                                  titleField="fullName" 
                                  onSave={() => editMember(member)} 
                                  onDelete={() => deleteMember(member.id)} 
                                />"""
code = re.sub(old_active, new_active, code)

# pendingMembers
old_pending = r"""<button\s*onClick=\{\(\) => approveMember\(member\.id\)\}\s*className="flex items-center gap-1.5 bg-primary hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"\s*>\s*<CheckCircle size=\{16\} /> Approve\s*</button>\s*<button\s*onClick=\{\(\) => rejectMember\(member\.id\)\}\s*className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"\s*>\s*Reject\s*</button>\s*<button\s*onClick=\{\(\) => deleteMember\(member\.id\)\}\s*className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"\s*>\s*Delete\s*</button>"""
new_pending = """<AdminItemActions 
                                collectionName="memberships" 
                                item={member} 
                                onRefresh={fetchMembers} 
                                titleField="fullName" 
                                onApprove={() => approveMember(member.id)}
                                onReject={() => rejectMember(member.id)}
                                onDelete={() => deleteMember(member.id)}
                              />"""
code = re.sub(old_pending, new_pending, code)

# cabinetMembers
old_cabinet = r"""<td className="p-4 flex gap-2"><button onClick=\{\(\) => editCabinetMember\(member\)\} className="bg-green-100 text-green-800 px-3 py-1.5 rounded text-sm font-medium">Edit</button><button onClick=\{\(\) => deleteCabinetMember\(member\.id\)\} className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm font-medium">Delete</button></td>"""
new_cabinet = """<td className="p-4">
                            <AdminItemActions 
                              collectionName="cabinet" 
                              item={member} 
                              onRefresh={fetchCabinet} 
                              titleField="name" 
                              onSave={() => editCabinetMember(member)}
                              onDelete={() => deleteCabinetMember(member.id)}
                            />
                          </td>"""
code = re.sub(old_cabinet, new_cabinet, code)

# bloodRequests
old_blood = r"""<button\s*onClick=\{\(\) => deleteBloodRequest\(req\.id\)\}\s*className="text-red-500 hover:text-red-700 text-sm font-bold"\s*>\s*Delete Request\s*</button>"""
new_blood = """<AdminItemActions collectionName="bloodDonation" item={req} onRefresh={fetchBloodRequests} titleField="patientName" />"""
code = re.sub(old_blood, new_blood, code)

# overseas
old_overseas = r"""<button\s*onClick=\{\(\) => deleteOverseas\(reg\.id\)\}\s*className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"\s*>\s*Delete\s*</button>"""
new_overseas = """<AdminItemActions collectionName="overseasRegistration" item={reg} onRefresh={fetchOverseas} titleField="Full name" />"""
code = re.sub(old_overseas, new_overseas, code)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
