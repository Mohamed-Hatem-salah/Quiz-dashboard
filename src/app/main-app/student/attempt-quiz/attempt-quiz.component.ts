import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { QuizDataService, Quiz, Question } from '../../quiz.service';
import { HlmButton } from '@spartan-ng/helm/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-attempt-quiz',
  standalone: true,
  imports: [HlmButton, FormsModule, CommonModule, HlmInput],
  templateUrl: './attempt-quiz.component.html',
  styleUrl: './attempt-quiz.component.css',
})
export class AttemptQuizComponent implements OnInit, OnDestroy {
  quiz!: Quiz;
  currentIndex = 0;

  selectedAnswers: { [questionId: string]: string } = {};
  timeLeft!: number;
  timerInterval: any;

  constructor(private router: Router, private quizService: QuizDataService) {}

  ngOnInit(): void {
    const found = this.quizService.getCurrentQuiz();
    if (!found) {
      alert('No quiz selected');
      this.router.navigate(['/student-dashboard']);
      return;
    }

    this.quiz = found;

    // Initialize answers and option IDs
    this.quiz.questions.forEach((q, i) => {
      if (!q.id) q.id = `q${i + 1}`;
      if (q.type === 'mcq') {
        q.options?.forEach((o, idx) => {
          if (!o.id) o.id = idx.toString();
        });
      }
    });

    // Calculate remaining time
    if (this.quiz.startedAt) {
      const elapsed = Math.floor(
        (Date.now() - new Date(this.quiz.startedAt).getTime()) / 1000
      );
      this.timeLeft = this.quiz.duration * 60 - elapsed;
    } else {
      this.timeLeft = this.quiz.duration * 60;
      this.quiz.startedAt = new Date();
      this.quizService.setCurrentQuiz(this.quiz);
    }

    if (this.timeLeft > 0) this.startTimer();
    else this.submitQuiz(); // expired instantly
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) this.timeLeft--;
      else this.submitQuiz();
    }, 1000);
  }

  get currentQuestion(): Question {
    return this.quiz.questions[this.currentIndex];
  }

  selectAnswer(optionId: string | number) {
    this.selectedAnswers[this.currentQuestion.id] = optionId.toString();
  }

  nextQuestion() {
    if (this.currentIndex < this.quiz.questions.length - 1) this.currentIndex++;
  }

  previousQuestion() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  get progress(): number {
    return ((this.currentIndex + 1) / this.quiz.questions.length) * 100;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  submitQuiz() {
    clearInterval(this.timerInterval);

    // Save student's answers
    this.quiz.studentAnswers = { ...this.selectedAnswers };

    // Move quiz to grading state
    this.quizService.setGrading(this.quiz);

    console.log('Submitted answers:', this.quiz.studentAnswers);

    this.router.navigate(['/student-dashboard']);
  }
}
