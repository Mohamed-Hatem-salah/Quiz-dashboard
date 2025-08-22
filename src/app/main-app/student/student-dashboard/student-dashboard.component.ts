import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizDataService, Quiz, QuizStatus } from '../../quiz.service';
import { Router } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, HlmButton],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizDataService, private router: Router) {}

  ngOnInit(): void {
    this.quizzes = this.quizService.getQuizzes();
  }
  startQuiz(quiz: Quiz) {
    this.quizService.setCurrentQuiz(quiz);
    this.router.navigate(['/attempt-quiz']);
  }
  getTotalPoints(quiz: Quiz): number {
    return quiz.questions.reduce((sum, q) => sum + q.points, 0);
  }
}
