import re

with open('src/components/Admin.tsx', 'r') as f:
    code = f.read()

# Donations
old_donations = r"""<span className="font-bold text-green-600">\{d\.amount\}</span>"""
new_donations = """<div>
                        <span className="font-bold text-green-600 block text-right mb-2">{d.amount}</span>
                        <AdminItemActions collectionName="donations" item={d} onRefresh={fetchDonations} titleField="donorName" />
                      </div>"""
code = re.sub(old_donations, new_donations, code)

# Meetings
old_meetings = r"""<p className="text-gray-600 text-sm whitespace-pre-wrap">\{meeting\.summary\}</p>"""
new_meetings = """<p className="text-gray-600 text-sm whitespace-pre-wrap">{meeting.summary}</p>
                      <AdminItemActions collectionName="cabinetMeetings" item={meeting} onRefresh={fetchMeetings} titleField="summary" />"""
code = re.sub(old_meetings, new_meetings, code)

# News
old_news = r"""<button onClick=\{\(\) => deleteNews\(n\.id\)\} className="text-red-500 text-xs font-bold">Delete</button>"""
new_news = """<AdminItemActions collectionName="announcements" item={n} onRefresh={fetchNewsAndEvents} titleField="title" />"""
code = re.sub(old_news, new_news, code)

# Events
old_events = r"""<button onClick=\{\(\) => deleteEvent\(ev\.id\)\} className="text-red-500 text-xs font-bold">Delete</button>"""
new_events = """<AdminItemActions collectionName="events" item={ev} onRefresh={fetchNewsAndEvents} titleField="title" />"""
code = re.sub(old_events, new_events, code)

# Ads
old_ads = r"""<button onClick=\{\(\) => deleteAd\(ad\.id\)\} className="text-red-500 text-sm font-bold">Delete</button>"""
new_ads = """<AdminItemActions collectionName="paidAds" item={ad} onRefresh={fetchAds} titleField="title" />"""
code = re.sub(old_ads, new_ads, code)

with open('src/components/Admin.tsx', 'w') as f:
    f.write(code)
