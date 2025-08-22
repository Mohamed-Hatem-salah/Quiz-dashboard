import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../student/header/header.component';

@Component({
  selector: 'app-layout-student',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './layout-student.component.html',
  styleUrl: './layout-student.component.css',
})
export class LayoutStudentComponent {}
