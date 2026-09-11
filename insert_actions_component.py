import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

component = """
const AdminItemActions = ({ 
  collectionName, 
  item, 
  onRefresh, 
  titleField,
  onApprove,
  onReject,
  onDelete,
  onSave,
  extraButtons
}: { 
  collectionName: string, 
  item: any, 
  onRefresh: () => void, 
  titleField: string,
  onApprove?: () => void,
  onReject?: () => void,
  onDelete?: () => void,
  onSave?: () => void,
  extraButtons?: React.ReactNode
}) => {
  const handleApprove = onApprove || (async () => {
    try { await updateDoc(doc(db, collectionName, item.id), { status: 'Approved' }); alert('Approved!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleReject = onReject || (async () => {
    try { await updateDoc(doc(doc(db, collectionName, item.id)), { status: 'Rejected' }); alert('Rejected!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleDelete = onDelete || (async () => {
    if(!confirm('Delete this item?')) return;
    try { await deleteDoc(doc(db, collectionName, item.id)); alert('Deleted!'); onRefresh(); } catch (e:any) { alert(e.message); }
  });
  const handleSave = onSave || (async () => {
    const newValue = prompt(`Edit ${titleField} (Save action):`, item[titleField] || '');
    if (newValue === null) return;
    try { 
      await updateDoc(doc(db, collectionName, item.id), { [titleField]: newValue }); 
      alert('Saved!'); 
      onRefresh(); 
    } catch (e:any) { 
      alert(e.message); 
    }
  });

  return (
    <div className="flex flex-wrap gap-2 mt-3 items-center">
      <button onClick={handleSave} className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Save</button>
      <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>
      <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>
      <button onClick={handleDelete} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
      {extraButtons}
    </div>
  )
}
"""

if "const AdminItemActions" not in code:
    code = code.replace("export function Admin() {", component + "\nexport function Admin() {")

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
