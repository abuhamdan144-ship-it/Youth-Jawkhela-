import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# Remove fetch functions
fetch_block_start = code.find("  const fetchAdsAndBlood = async () => {")
fetch_block_end = code.find("  const handleAddMember = async (e: React.FormEvent) => {")

if fetch_block_start != -1 and fetch_block_end != -1:
    code = code[:fetch_block_start] + code[fetch_block_end:]

# Replace old fetch calls inside handleAdd* functions
code = code.replace("fetchMembers();", "fetchCollection('memberships');")
code = code.replace("fetchDonations();", "fetchCollection('donations');")
code = code.replace("fetchAdsAndBlood();", "fetchCollection('bloodDonation'); fetchCollection('paidAds'); fetchCollection('overseasRegistration');")
code = code.replace("fetchCabinet();", "fetchCollection('cabinet');")
code = code.replace("fetchMeetings();", "fetchCollection('cabinetMeetings');")
code = code.replace("fetchNewsAndEvents();", "fetchCollection('announcements'); fetchCollection('events');")

# Clean up AdminItemActions props
# 1. Remove `onRefresh={...}`
code = re.sub(r'\s*onRefresh=\{[a-zA-Z]+\}', '', code)
# 2. Remove `onApprove={...}`
code = re.sub(r'\s*onApprove=\{.*?\}', '', code)
# 3. Remove `onReject={...}`
code = re.sub(r'\s*onReject=\{.*?\}', '', code)
# 4. Remove `onDelete={...}`
code = re.sub(r'\s*onDelete=\{.*?\}', '', code)
# 5. Remove `onSave={...}`
code = re.sub(r'\s*onSave=\{.*?\}', '', code)

# Note: Some elements used custom `onSave` or `onDelete` which we just replaced. 
# But the prompt says: "ensuring the 'Save', 'Delete', and 'Approve/Reject' buttons are correctly mapped to their respective document IDs and collection references."
# By using `saveItemField` and `deleteItem` from the hook inside `AdminItemActions`, this mapping is universally handled based on the `collectionName` prop.

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
