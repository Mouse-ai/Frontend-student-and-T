import { Mentor, Slot } from '../types';

export const MOCK_MENTORS: Mentor[] = [
  { id: 1, name: "Алексей Иванов", role: "Senior Backend", stack: ["Python", "FastAPI"], available: true },
  { id: 2, name: "Мария Петрова", role: "Product Manager", stack: ["Analytics", "Scrum"], available: false },
  { id: 3, name: "Дмитрий Сидоров", role: "Frontend Lead", stack: ["React", "Vue"], available: true },
  { id: 4, name: "Елена Козлова", role: "DevOps", stack: ["Docker", "K8s"], available: true },
  { id: 5, name: "Иван Смирнов", role: "Data Scientist", stack: ["Python", "ML"], available: true },
];

export const MOCK_SLOTS: Slot[] = [
  { id: "s1", date: "2026-04-16", time: "10:00", status: "free" },
  { id: "s2", date: "2026-04-16", time: "12:00", status: "booked" },
  { id: "s3", date: "2026-04-16", time: "14:00", status: "free" },
  { id: "s4", date: "2026-04-16", time: "16:00", status: "free" },
];
