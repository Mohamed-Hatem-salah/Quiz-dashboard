// src/app/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;
  private role: 'student' | 'teacher' | null = null;

  constructor() {
    // 🔹 Restore from localStorage when service is created
    const savedLoggedIn = localStorage.getItem('loggedIn');
    const savedRole = localStorage.getItem('role');

    this.loggedIn = savedLoggedIn === 'true';
    this.role = savedRole as 'student' | 'teacher' | null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getRole(): 'student' | 'teacher' | null {
    return this.role;
  }

  login(username: string, password: string): 'student' | 'teacher' | null {
    if (username.startsWith('student')) {
      this.loggedIn = true;
      this.role = 'student';
    } else if (username.startsWith('teacher')) {
      this.loggedIn = true;
      this.role = 'teacher';
    } else {
      this.loggedIn = false;
      this.role = null;
    }

    // 🔹 Save to localStorage
    localStorage.setItem('loggedIn', this.loggedIn.toString());
    localStorage.setItem('role', this.role ?? '');

    return this.role;
  }

  logout() {
    this.loggedIn = false;
    this.role = null;

    // 🔹 Clear localStorage
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('role');
  }
}
