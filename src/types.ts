export interface LessonPart {
  type: 'text' | 'question' | 'example' | 'image' | 'icon' | 'combine' | 'affix-explorer' | 'fill-blank' | 'order-sentences';
  content: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  imageUrl?: string;
  iconName?: string;
  // For combine type
  root?: string;
  targetMeaning?: string;
  // For order-sentences
  pieces?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  parts: LessonPart[];
}

export interface ResourceItem {
  title: string;
  description: string;
  url: string;
  category: 'Video' | 'Course' | 'Community' | 'Dictionary' | 'Reading' | 'Music' | 'Shop';
  icon: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  imageUrl?: string;
  createdAt: number;
  lastReview?: number;
  nextReview?: number;
  interval?: number;
  easeFactor?: number;
  reps?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface DashboardSettings {
  layout: 'grid' | 'list';
  sections: {
    progress: 'emerald' | 'blue' | 'violet' | 'rose';
    achievements: 'emerald' | 'blue' | 'violet' | 'rose';
    settings: 'emerald' | 'blue' | 'violet' | 'rose';
    leaderboard: 'emerald' | 'blue' | 'violet' | 'rose';
  };
}

export interface NotificationSettings {
  lessonReminders: boolean;
  newContentAlerts: boolean;
  soundEnabled: boolean;
  dashboard: DashboardSettings;
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
  lastLessonId?: string;
  badges: string[]; // IDs of unlocked badges
  lessonScores?: { lessonId: string; score: number; timestamp: number }[];
}

export interface SyncQueueItem {
  lessonId: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
