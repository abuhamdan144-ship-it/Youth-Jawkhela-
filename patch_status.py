import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

old_actions = """  return (
    <div className="flex flex-col gap-2">
      {item.status && <div className={`text-xs font-bold px-2 py-1 rounded w-max ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>Status: {item.status}</div>}"""

new_actions = """  const currentStatus = item.status || 'Pending';
  return (
    <div className="flex flex-col gap-2">
      <div className={`text-xs font-bold px-2 py-1 rounded w-max ${currentStatus === 'Approved' ? 'bg-green-100 text-green-800' : currentStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>Status: {currentStatus}</div>"""

code = code.replace(old_actions, new_actions)

old_buttons = """        {item.status !== 'Approved' && <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>}
        {item.status !== 'Rejected' && <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>}"""

new_buttons = """        {currentStatus !== 'Approved' && <button onClick={handleApprove} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Approve</button>}
        {currentStatus !== 'Rejected' && <button onClick={handleReject} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">Reject</button>}"""

code = code.replace(old_buttons, new_buttons)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
