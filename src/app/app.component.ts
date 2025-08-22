import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HlmToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'quiz-dashboard';
}
