import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quiz, QuizStatus, Question, Option } from './quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizDataService {
  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  quizzes$ = this.quizzesSubject.asObservable();

  private currentQuiz: Quiz | null = null;

  constructor() {
    // Load quizzes from localStorage
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      const parsed: Quiz[] = JSON.parse(savedQuizzes).map((q: any) => ({
        ...q,
        startTime: new Date(q.startTime),
      }));
      this.quizzesSubject.next(parsed.map(this.evaluateQuizStatus));
    }

    const savedCurrentQuiz = localStorage.getItem('currentQuiz');
    if (savedCurrentQuiz) {
      const parsed = JSON.parse(savedCurrentQuiz);
      this.currentQuiz = { ...parsed, startTime: new Date(parsed.startTime) };
      if (this.currentQuiz) {
        this.currentQuiz = this.evaluateQuizStatus(this.currentQuiz);
      }
    }
  }

  addQuiz(quiz: Quiz) {
    const updatedQuizzes = [
      ...this.quizzesSubject.value,
      this.evaluateQuizStatus(quiz),
    ];
    this.quizzesSubject.next(updatedQuizzes);
    this.saveQuizzes(updatedQuizzes);
  }

  getQuizzes(): Quiz[] {
    const updated = this.quizzesSubject.value.map(this.evaluateQuizStatus);
    this.quizzesSubject.next(updated);
    return updated;
  }

  setCurrentQuiz(quiz: Quiz) {
    this.currentQuiz = this.evaluateQuizStatus(quiz);
    localStorage.setItem(
      'currentQuiz',
      JSON.stringify({
        ...quiz,
        startTime: (quiz.startTime as Date).toISOString(),
      })
    );
  }

  getCurrentQuiz(): Quiz | null {
    if (!this.currentQuiz) return null;
    this.currentQuiz = this.evaluateQuizStatus(this.currentQuiz);

    // If expired without starting
    if (this.currentQuiz.status === 'expired') {
      this.clearCurrentQuiz();
      return null;
    }
    return this.currentQuiz;
  }

  clearCurrentQuiz() {
    this.currentQuiz = null;
    localStorage.removeItem('currentQuiz');
  }

  // Evaluate status based on timing, submission, grading
  private evaluateQuizStatus = (quiz: Quiz): Quiz => {
    const now = Date.now();
    const start = quiz.startTime.getTime();
    const end = start + quiz.duration * 60000;

    let status: QuizStatus;

    if (quiz.grade !== undefined) {
      status = 'finished'; // student finished and graded
    } else if (
      quiz.studentAnswers &&
      Object.keys(quiz.studentAnswers).length > 0
    ) {
      status = 'grading'; // student submitted, waiting for teacher
    } else if (now < start) {
      status = 'scheduled'; // before start
    } else if (now >= start && now <= end) {
      status = 'active'; // within time window
    } else if (now > end && !quiz.studentAnswers) {
      status = 'expired'; // time passed, not started
    } else {
      status = 'waiting';
    }

    return { ...quiz, status, startTime: new Date(quiz.startTime) };
  };

  // Called when student submits quiz
  setGrading(quiz: Quiz) {
    this.updateQuiz(quiz.id, {
      status: 'grading',
      studentAnswers: quiz.studentAnswers,
      startedAt: quiz.startedAt ?? new Date(),
    });
  }

  // Teacher grades the quiz
  gradeQuiz(quiz: Quiz, grade: number) {
    this.updateQuiz(quiz.id, { grade, status: 'finished' });
  }

  finishQuiz(quiz: Quiz, grade: number) {
    this.updateQuiz(quiz.id, {
      grade,
      status: 'finished',
      startedAt: quiz.startedAt ?? new Date(),
    });
    this.clearCurrentQuiz();
  }

  private updateQuiz(id: string, changes: Partial<Quiz>) {
    const updated = this.quizzesSubject.value.map((q) =>
      q.id === id ? this.evaluateQuizStatus({ ...q, ...changes }) : q
    );
    this.quizzesSubject.next(updated);
    this.saveQuizzes(updated);

    if (this.currentQuiz && this.currentQuiz.id === id) {
      this.currentQuiz = this.evaluateQuizStatus({
        ...this.currentQuiz,
        ...changes,
      });
      localStorage.setItem(
        'currentQuiz',
        JSON.stringify({
          ...this.currentQuiz,
          startTime: (this.currentQuiz.startTime as Date).toISOString(),
        })
      );
    }
  }

  private saveQuizzes(quizzes: Quiz[]) {
    const saveable = quizzes.map((q) => ({
      ...q,
      startTime: (q.startTime as Date).toISOString(),
    }));
    localStorage.setItem('quizzes', JSON.stringify(saveable));
  }
}

export type { Quiz, QuizStatus, Question, Option };
