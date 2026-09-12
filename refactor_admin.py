import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# 1. Add imports
imports_to_add = "import { AdminProvider, useAdminData, CollectionName } from '../hooks/useAdminData';\n"
code = code.replace("import { MetalButton } from './ui/metal-button';", "import { MetalButton } from './ui/metal-button';\n" + imports_to_add)

# 2. Refactor AdminItemActions
old_admin_item_actions = r"const AdminItemActions = \({[\s\S]*?extraButtons\n}: {[\s\S]*?extraButtons\?: React\.ReactNode\n}\) => {[\s\S]*?const currentStatus = item\.status \|\| 'Pending';"

new_admin_item_actions = """const AdminItemActions = ({ 
  collectionName, 
  item, 
  titleField,
  extraButtons
}: { 
  collectionName: CollectionName, 
  item: any, 
  titleField: string,
  extraButtons?: React.ReactNode
}) => {
  const { deleteItem, approveItem, rejectItem, saveItemField } = useAdminData();
  const handleApprove = () => approveItem(collectionName, item.id);
  const handleReject = () => rejectItem(collectionName, item.id);
  const handleDelete = () => deleteItem(collectionName, item.id);
  const handleSave = () => saveItemField(collectionName, item.id, titleField);
  const isRequestCollection = ['memberships', 'overseasRegistration', 'bloodDonation'].includes(collectionName);
  const currentStatus = item.status || 'Pending';"""

code = re.sub(old_admin_item_actions, new_admin_item_actions, code)

# 3. Rename default export Admin to AdminInner, and export Admin wrapped in Provider
code = code.replace("export default function Admin() {", "function AdminInner() {")

wrapper = """
export default function Admin() {
  return (
    <AdminProvider>
      <AdminInner />
    </AdminProvider>
  );
}
"""
code = code + wrapper

# 4. Replace state definitions inside AdminInner
state_regex = r"const \[pendingMembers, setPendingMembers\] = useState.*?\] = useState<any\[\]>\(\[\]\);"

new_state = """
  const { data, fetchAll, fetchCollection } = useAdminData();
  const pendingMembers = data.memberships.filter(m => m.status === 'Pending');
  const activeMembers = data.memberships.filter(m => m.status === 'Approved');
  const bloodRequests = data.bloodDonation;
  const cabinetMembers = data.cabinet;
  const meetings = data.cabinetMeetings;
  const news = data.announcements;
  const events = data.events;
  const ads = data.paidAds;
  const overseas = data.overseasRegistration;
  const donations = data.donations;
"""
# Since state definitions span multiple lines, let's find the exact block.
start_state = "const [pendingMembers, setPendingMembers] = useState<any[]>([]);"
end_state = "const [overseas, setOverseas] = useState<any[]>([]);"

start_idx = code.find(start_state)
end_idx = code.find(end_state) + len(end_state)

code = code[:start_idx] + new_state + code[end_idx:]

# 5. Remove fetch calls from useEffect
old_fetch_effect = """
      if (ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() || '')) {
        setAuthorized(true);
        fetchMembers();
        fetchDonations();
        fetchCabinet();
        fetchMeetings();
        fetchNewsAndEvents();
        fetchAdsAndBlood();
      } else {
"""
new_fetch_effect = """
      if (ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() || '')) {
        setAuthorized(true);
        fetchAll();
      } else {
"""
code = code.replace(old_fetch_effect, new_fetch_effect)

# 6. Delete all the old fetch functions
fetch_funcs = r"const fetchMembers = async \(\) => {[\s\S]*?const fetchDonations = async \(\) => {[\s\S]*?}\n  };"
# Actually it's easier to find the block of fetch functions manually.
# Let's replace the whole block from `const fetchAdsAndBlood` down to `fetchDonations`
# We can do this by regex or string manipulation.

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)

