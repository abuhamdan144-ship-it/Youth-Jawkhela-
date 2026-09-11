import { collection, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { db } from './firebase';

// Use this type to allow Firebase ServerTimestamps (FieldValue) on writes, and Timestamp/Date on reads.
export type TimestampValue = any; 

export interface UserSchema {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: TimestampValue;
}

export interface MembershipSchema {
  id?: string;
  userId: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  address: string;
  village: string;
  age: number;
  bloodGroup: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  cardNumber?: string;
  profileImageUrl?: string;
  issueDate?: TimestampValue;
  expiryDate?: TimestampValue;
  createdAt: TimestampValue;
}

export interface BloodDonationSchema {
  id?: string;
  patientName: string;
  bloodGroup: string;
  hospital: string;
  contact: string;
  urgency: 'Normal' | 'High' | 'Critical';
  status: 'Active' | 'Fulfilled';
  donorId?: string;
  createdAt: TimestampValue;
}

export interface CabinetSchema {
  id?: string;
  userId?: string;
  name: string;
  position: string;
  startDate: TimestampValue | string;
  endDate?: TimestampValue | string;
  phone?: string;
  profileImage?: string;
  responsibilities: string;
  status: 'Active' | 'Past';
}

export interface ElectionSchema {
  id?: string;
  title: string;
  date: TimestampValue | string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  candidates: { id: string; name: string; position: string; votes: number }[];
  winnerId?: string;
  createdAt: TimestampValue;
}

export interface CabinetMeetingSchema {
  id?: string;
  date: TimestampValue | string;
  agenda: string;
  minutes?: string;
  attendees: string[]; // Array of user IDs
  location: string;
  createdAt: TimestampValue;
}

export interface NewsSchema {
  id?: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  date: TimestampValue | string;
  createdAt: TimestampValue;
}

export interface EventSchema {
  id?: string;
  title: string;
  description: string;
  type: string;
  date: TimestampValue | string;
  time: string;
  location: string;
  createdAt: TimestampValue;
}

export interface DailyTaskSchema {
  id?: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: TimestampValue | string;
  createdAt: TimestampValue;
}

export interface AnnouncementSchema {
  id?: string;
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  date: TimestampValue | string;
  createdBy: string; // User ID
  createdAt: TimestampValue;
}

export interface CampaignSchema {
  id?: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  startDate: TimestampValue | string;
  endDate?: TimestampValue | string;
  status: 'Active' | 'Completed';
  imageUrl?: string;
  createdAt: TimestampValue;
}

export interface DonationSchema {
  id?: string;
  donorName: string;
  amount: number;
  paymentMethod: string;
  date: TimestampValue | string;
  campaignId?: string;
  receiptUrl?: string;
  createdAt: TimestampValue;
}

export interface OverseasRegistrationSchema {
  id?: string;
  userId: string;
  fullName: string;
  passportNumber: string;
  currentCountry: string;
  overseasAddress: string;
  contact: string;
  homeVillage: string;
  status: 'Pending' | 'Verified';
  createdAt: TimestampValue;
}

// A generic Firestore data converter to automatically type documents when reading/writing
const createConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T): DocumentData => {
    // Exclude the 'id' field from being written into the document body itself
    const { id, ...rest } = data;
    return rest as DocumentData;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T => {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...data } as T;
  }
});

// Centralized export of all fully-typed collection references
export const dbCollections = {
  users: collection(db, 'users').withConverter(createConverter<UserSchema>()),
  memberships: collection(db, 'memberships').withConverter(createConverter<MembershipSchema>()),
  bloodDonation: collection(db, 'bloodDonation').withConverter(createConverter<BloodDonationSchema>()),
  cabinet: collection(db, 'cabinet').withConverter(createConverter<CabinetSchema>()),
  elections: collection(db, 'elections').withConverter(createConverter<ElectionSchema>()),
  cabinetMeetings: collection(db, 'cabinetMeetings').withConverter(createConverter<CabinetMeetingSchema>()),
  news: collection(db, 'news').withConverter(createConverter<NewsSchema>()),
  events: collection(db, 'events').withConverter(createConverter<EventSchema>()),
  dailyTasks: collection(db, 'dailyTasks').withConverter(createConverter<DailyTaskSchema>()),
  announcements: collection(db, 'announcements').withConverter(createConverter<AnnouncementSchema>()),
  campaigns: collection(db, 'campaigns').withConverter(createConverter<CampaignSchema>()),
  donations: collection(db, 'donations').withConverter(createConverter<DonationSchema>()),
  overseasRegistration: collection(db, 'overseasRegistration').withConverter(createConverter<OverseasRegistrationSchema>()),
};
