import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataStoreService, StoredStudent } from '../connections/data-store.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: StoredStudent[] = [];
  filteredStudents: StoredStudent[] = [];
  currentStudent: Omit<StoredStudent, 'id'> & { id: number | null } = {
    id: null,
    name: '',
    email: '',
    grade: '',
    phone: ''
  };
  isEditMode = false;
  showModal = false;
  showSuccessAlert = false;
  searchTerm = '';

  constructor(private store: DataStoreService) {}

  ngOnInit() {
    const saved = this.store.getStudents();
    this.students = saved.length ? saved : [
      { id: 1, name: 'mo', email: 'r@gmail.com', grade: '11', phone: '0100000' }
    ];
    this.filteredStudents = [...this.students];
    this.persist();
  }

  filterStudents() {
    if (!this.searchTerm) {
      this.filteredStudents = [...this.students];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student => 
      student.name.toLowerCase().includes(term) || 
      student.email.toLowerCase().includes(term) ||
      student.grade.toLowerCase().includes(term) ||
      (student.phone && student.phone.toLowerCase().includes(term))
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentStudent = {
      id: null,
      name: '',
      email: '',
      grade: '',
      phone: ''
    };
    this.showModal = true;
  }

  editStudent(student: any) {
    this.isEditMode = true;
    this.currentStudent = {...student};
    this.showModal = true;
  }

  confirmAction(student: any) {
    // Implement your confirmation logic here
    // For example, mark student as approved/confirmed
    console.log('Confirmed student:', student);
    // You can add your specific confirmation logic
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.students = this.students.filter(student => student.id !== id);
      this.filterStudents();
      this.persist();
    }
  }

  addStudent() {
    this.currentStudent.id = this.students.length > 0 
      ? Math.max(...this.students.map(s => s.id)) + 1 
      : 1;
    this.students.push({
      id: this.currentStudent.id as number,
      name: this.currentStudent.name,
      email: this.currentStudent.email,
      grade: this.currentStudent.grade,
      phone: this.currentStudent.phone
    });
    this.showSuccess();
    this.closeModal();
    this.filterStudents();
    this.persist();
  }

  updateStudent() {
    const index = this.students.findIndex(s => s.id === this.currentStudent.id);
    if (index !== -1) {
      this.students[index] = {
        id: this.currentStudent.id as number,
        name: this.currentStudent.name,
        email: this.currentStudent.email,
        grade: this.currentStudent.grade,
        phone: this.currentStudent.phone
      };
      this.showSuccess();
      this.closeModal();
      this.filterStudents();
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
    this.store.saveStudents(this.students);
  }
}