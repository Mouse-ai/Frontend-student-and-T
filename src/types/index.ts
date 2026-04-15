export interface Mentor {
  id: number;
  name: string;
  role: string;
  stack: string[];
  available: boolean;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  status: 'free' | 'booked';
}

export interface User {
  id: number;
  name: string;
  role: 'student' | 'mentor' | 'admin';
}
