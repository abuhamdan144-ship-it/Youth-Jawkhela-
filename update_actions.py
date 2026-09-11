import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

old_actions = """  return (
    <div className="flex flex-wrap gap-2 mt-3 items-center">
      <button onClick={handleSave} className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Save</button>
      <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>
      <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>
      <button onClick={handleDelete} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
      {extraButtons}
    </div>
  )"""

new_actions = """  return (
    <div className="flex flex-col gap-2">
      {item.status && <div className={`text-xs font-bold px-2 py-1 rounded w-max ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>Status: {item.status}</div>}
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={handleSave} className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Save</button>
        {item.status !== 'Approved' && <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>}
        {item.status !== 'Rejected' && <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>}
        <button onClick={handleDelete} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Delete</button>
        {extraButtons}
      </div>
    </div>
  )"""

code = code.replace(old_actions, new_actions)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
