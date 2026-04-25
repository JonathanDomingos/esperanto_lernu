export interface LessonPart {
  type: 'text' | 'question' | 'example' | 'image' | 'icon' | 'combine';
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  imageUrl?: string;
  iconName?: string;
  // For combine type
  root?: string;
  targetMeaning?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  parts: LessonPart[];
}

export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  category: 'Video' | 'Course' | 'Community' | 'Dictionary';
  icon: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  imageUrl?: string;
  createdAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface NotificationSettings {
  lessonReminders: boolean;
  newContentAlerts: boolean;
  soundEnabled: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: number;
  read: boolean;
}

export interface UserStats {
  points: number;
  streak: number;
  lastActivityDate?: string;
  badges: string[]; // IDs of unlocked badges
}

export interface SyncQueueItem {
  lessonId: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
