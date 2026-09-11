export type User = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  registrationDate: Date;
  membershipStatus: 'pending' | 'active' | 'inactive';
  membershipTier: 'regular' | 'overseas';
  bloodType: string;
  isAdmin: boolean;
  isOverseas: boolean;
  country: string;
  profileImage: string;
  membershipCardGenerated: boolean;
  certificateGenerated: boolean;
  lastUpdated: Date;
};

export type Membership = {
  memberId: string;
  membershipNumber: string; // ZJ-2024-001
  joiningDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'suspended';
  cardUrl: string;
  certificateUrl: string;
  approvedBy: string;
  approvalDate: Date;
  renewalHistory: any[];
};

export type BloodDonation = {
  donorId: string;
  bloodType: string;
  lastDonationDate: Date;
  units: number;
  healthStatus: string;
  emergencyContact: string;
  emergencyPhone: string;
  canDonate: boolean;
  medicalNotes: string; // admin only
  visibility: 'admin-only';
};

export type Cabinet = {
  memberId: string;
  position: string;
  tenure: { startDate: Date; endDate: Date };
  electedIn: string;
  contactPhone: string;
  responsibilities: string;
  profileImage: string;
};

export type Election = {
  electionId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'active' | 'closed' | 'results';
  candidates: { candidateId: string; name: string; position: string; bio: string; votes: number }[];
  eligibleVoters: string[];
  votersParticipated: string[];
  results: any;
};

export type CabinetMeeting = {
  meetingId: string;
  date: Date;
  location: string;
  attendees: string[];
  agendaItems: string[];
  summary: string;
  decisions: string[];
  nextMeetingDate: Date;
  minutesDocument: string;
  recordedBy: string;
};

export type News = {
  newsId: string;
  title: { urdu: string; english: string };
  content: string;
  excerpt: string;
  featuredImage: string;
  createdDate: Date;
  publishedDate: Date;
  author: string;
  category: 'community' | 'welfare' | 'events' | 'emergency';
  status: 'draft' | 'published' | 'archived';
  views: number;
};

export type Event = {
  eventId: string;
  title: { urdu: string; english: string };
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  bannerImage: string;
  organizer: string;
  attendeeLimit: number;
  registeredAttendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  cost: number;
};

export type DailyTask = {
  taskId: string;
  title: string;
  description: string;
  date: Date;
  images: string[];
  uploadedBy: string;
  uploadedDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'cancelled';
};

export type Announcement = {
  announcementId: string;
  title: string; // urdu
  message: string;
  type: 'alert' | 'notice' | 'update' | 'emergency';
  publishedDate: Date;
  expiryDate: Date;
  priority: string;
  image?: string;
  displayOnHero: boolean;
  createdBy: string;
};

export type Campaign = {
  campaignId: string;
  title: { urdu: string; english: string };
  description: string;
  campaignType: 'awareness' | 'fundraising' | 'health' | 'education';
  startDate: Date;
  endDate: Date;
  bannerImage: string;
  content: string; // rich text/video
  targetAudience: 'all' | 'members' | 'overseas';
  status: 'planned' | 'active' | 'completed';
  createdBy: string;
};

export type Donation = {
  donationId: string;
  donorName: string;
  amount: number;
  method: 'bank' | 'easypaisa' | 'cash';
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  receiptUrl: string;
  purpose: 'community-fund' | 'emergency' | 'specific-project';
  contactPhone: string;
};

export type OverseasRegistration = {
  registrationId: string;
  userId: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  dateOfBirth: Date;
  originalVillage: string;
  currentCountry: string;
  currentCity: string;
  occupation: string;
  contactPhone: string;
  email: string;
  familyRelations: string[];
  registrationDate: Date;
  documentProof: string;
  status: 'pending' | 'verified' | 'rejected';
};
