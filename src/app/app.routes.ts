import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { OverviewComponent } from './layout/overview/overview.component';
import { StudentComponent } from './layout/student/student.component';
import { TeacherComponent } from './layout/teacher/teacher.component';
import { ConnectionsComponent } from './layout/connections/connections.component';
import { RelashionMapComponent } from './layout/relashion-map/relashion-map.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { IndexComponent } from './main-app/index/index.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LayoutStudentComponent } from './main-app/layout-student/layout-student.component';
import { StudentDashboardComponent } from './main-app/student/student-dashboard/student-dashboard.component';

import { authGuard } from './auth.guard';
import { QuizFormComponent } from './main-app/teacher/quiz-form/quiz-form.component';

import { AttemptQuizComponent } from './main-app/student/attempt-quiz/attempt-quiz.component';

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'sign-in', component: SignInComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    data: { role: 'teacher' },
    children: [
      { path: 'home', component: OverviewComponent },
      { path: 'student', component: StudentComponent },
      { path: 'teacher', component: TeacherComponent },
      { path: 'connections', component: ConnectionsComponent },
      { path: 'relashion-map', component: RelashionMapComponent },
    ],
  },
  {
    path: '',
    component: LayoutStudentComponent,
    canActivate: [authGuard],
    data: { role: 'teacher' },
    children: [{ path: 'create-quiz', component: QuizFormComponent }],
  },
  {
    path: '',
    component: LayoutStudentComponent,
    canActivate: [authGuard],
    data: { role: 'student' },
    children: [
      { path: 'student-dashboard', component: StudentDashboardComponent },
      { path: 'attempt-quiz', component: AttemptQuizComponent },
    ],
  },

  { path: '**', component: ErrorpageComponent },
];
