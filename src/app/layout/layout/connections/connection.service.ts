// src/app/services/connection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Connection {
  id: number;
  studentId: number;
  teacherId: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionsSubject = new BehaviorSubject<Connection[]>([]);
  connections$ = this.connectionsSubject.asObservable();

  private lastId = 0;

  constructor() {
    // Initialize with some sample data if needed
    this.addConnection(1, 1); // mo -> ahmed
    this.addConnection(1, 2); // mo -> mo (teacher)
  }

  addConnection(studentId: number, teacherId: number) {
    const newConnection: Connection = {
      id: ++this.lastId,
      studentId,
      teacherId,
      createdAt: new Date()
    };
    const current = this.connectionsSubject.value;
    this.connectionsSubject.next([...current, newConnection]);
  }

  removeConnection(id: number) {
    const current = this.connectionsSubject.value.filter(c => c.id !== id);
    this.connectionsSubject.next(current);
  }

  getConnectionsByStudent(studentId: number) {
    return this.connectionsSubject.value.filter(c => c.studentId === studentId);
  }

  getConnectionsByTeacher(teacherId: number) {
    return this.connectionsSubject.value.filter(c => c.teacherId === teacherId);
  }

  getAllConnections() {
    return this.connectionsSubject.value;
  }
}