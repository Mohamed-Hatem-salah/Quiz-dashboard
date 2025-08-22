import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataStoreService, StoredTeacher } from '../connections/data-store.service';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  phone: string;
}

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  currentTeacher: Omit<Teacher, 'id'> & { id: number | null } = {
    id: null,
    name: '',
    email: '',
    subject: '',
    phone: ''
  };
  isEditMode = false;
  showModal = false;
  showSuccessAlert = false;
  searchTerm = '';

  constructor(private store: DataStoreService) {}

  ngOnInit() {
    const saved = this.store.getTeachers();
    this.teachers = saved.length ? saved : [
      { id: 1, name: 'Ms. Davis', email: 'davis@example.com', subject: 'Chemistry', phone: '0110000' },
      { id: 2, name: 'Mr. Wilson', email: 'wilson@example.com', subject: 'Biology', phone: '0120000' },
      { id: 3, name: 'Mrs. Brown', email: 'brown@example.com', subject: 'English', phone: '0100000' },
      { id: 4, name: 'Dr. Martinez', email: 'martinez@example.com', subject: 'History', phone: '0130000' }
    ];
    this.filteredTeachers = [...this.teachers];
    this.persist();
  }

  filterTeachers() {
    if (!this.searchTerm) {
      this.filteredTeachers = [...this.teachers];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredTeachers = this.teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(term) || 
      teacher.email.toLowerCase().includes(term) ||
      teacher.subject.toLowerCase().includes(term) ||
      teacher.phone.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentTeacher = {
      id: null,
      name: '',
      email: '',
      subject: '',
      phone: ''
    };
    this.showModal = true;
  }

  editTeacher(teacher: Teacher) {
    this.isEditMode = true;
    this.currentTeacher = {...teacher};
    this.showModal = true;
  }

  confirmAction(teacher: Teacher) {
    console.log('Confirmed teacher:', teacher);
  }

  deleteTeacher(id: number) {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teachers = this.teachers.filter(teacher => teacher.id !== id);
      this.filterTeachers();
      this.persist();
    }
  }

  addTeacher() {
    // Generate new ID safely
    const newId = this.teachers.length > 0 
      ? Math.max(...this.teachers.map(t => t.id)) + 1 
      : 1;
    
    // Create new teacher with required ID
    const newTeacher: Teacher = {
      id: newId,
      name: this.currentTeacher.name,
      email: this.currentTeacher.email,
      subject: this.currentTeacher.subject,
      phone: this.currentTeacher.phone
    };

    this.teachers.push(newTeacher);
    this.showSuccess();
    this.closeModal();
    this.filterTeachers();
    this.persist();
  }

  updateTeacher() {
    if (this.currentTeacher.id === null) return;
    
    const index = this.teachers.findIndex(t => t.id === this.currentTeacher.id);
    if (index !== -1) {
      this.teachers[index] = {
        id: this.currentTeacher.id,
        name: this.currentTeacher.name,
        email: this.currentTeacher.email,
        subject: this.currentTeacher.subject,
        phone: this.currentTeacher.phone
      };
      this.showSuccess();
      this.closeModal();
      this.filterTeachers();
      this.persist();
    }
  }

  closeModal() {
    this.showModal = false;
  }

  showSuccess() {
    this.showSuccessAlert = true;
    setTimeout(() => this.showSuccessAlert = false, 3000);
  }

  private persist() {
    this.store.saveTeachers(this.teachers as StoredTeacher[]);
  }
}