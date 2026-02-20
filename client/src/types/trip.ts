export interface TripMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TripChat {
  id: string;
  title: string;
  destination: string;
  createdAt: Date;
  messages: TripMessage[];
}

export interface TripFormData {
  destination: string;
  duration: string;
  budget: string;
  companions: string;
}

export interface UserProfile {
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
}
