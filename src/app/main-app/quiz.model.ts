export type QuestionType = 'mcq' | 'written';

export interface Option {
  id: string; // keep string for UUID-like ids
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string; // string is good (UUID or DB id)
  text: string;
  type: QuestionType;
  points: number;
  options?: Option[]; // only for MCQs
  correctAnswer?: string; // for written, or store option id for MCQs
}

export type QuizStatus =
  | 'scheduled'
  | 'active'
  | 'expired'
  | 'grading'
  | 'finished'
  | 'waiting';

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  duration: number;
  startTime: Date;
  questions: Question[];
  status?: QuizStatus;
  grade?: number;
  startedAt?: Date;
  teacherGraded?: boolean;
  studentAnswers?: { [questionId: string]: string };
}
