import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputText } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ReactiveFormsModule,
    InputText,
    ColorPickerModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public loggedUser: any = null;
  public categories: any[] = [];
  public tasks: any[] = [];
  public categoryForm!: FormGroup;
  public taskForm!: FormGroup;

  public displayTaskModal: boolean = false;

  public priorityLabel = [
    { label: 'Alta', value: 'HIGH' },
    { label: 'Media', value: 'MEDIUM' },
    { label: 'Baixa', value: 'LOW' },
  ];

  public metrics = { pending: 0, completed: 0, delayed: 0 };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private taskService: TaskService,
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('userLogado');

    if (!userJson) {
      this.logout();
      return;
    }
    this.loggedUser = JSON.parse(userJson);
    this.initCategoryForm();
    this.initTaskForm();
    this.loadData();
  }

  private initTaskForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(50)],
      dueDate: [null, Validators.required],
      priority: ['MEDIUM', Validators.required],
      categoryId: [null, Validators.required],
    });
  }

  private loadData(): void {
    this.loadCategories();
    this.loadTask();
  }

  private initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      color: ['#3b82f6'],
    });
  }

  public loadTask(): void {
    this.taskService.getByUser(this.loggedUser.id).subscribe({
      next: (data) => {
        this.tasks = data;
        this.calculateMetrics();
      },
      error: (err) => console.log(err),
    });
  }

  private calculateMetrics(): void {
    const today = new Date();

    this.metrics.completed = this.tasks.filter(
      (t) => t.status === 'COMPLETED',
    ).length;
    this.metrics.pending = this.tasks.filter(
      (t) => t.status === 'PENDING',
    ).length;
    this.metrics.delayed = this.tasks.filter((t) => {
      return t.status === 'PENDING' && new Date(t.dueDate) < today;
    }).length;
  }

  public openTaskModal(): void {
    this.displayTaskModal = true;
  }
  public addTask(): void {
    if (this.taskForm.invalid) return;

    const newTask = {
      ...this.taskForm.value,
      userId: this.loggedUser.id,
    };

    this.taskService.create(newTask).subscribe({
      next: () => {
        this.displayTaskModal = false;
        this.taskForm.reset({ priority: 'MEDIA' });
        this.loadTask();
      },
      error: (err) => alert(err.error?.error || 'Erro ao criar tarefa'),
    });
  }

  public loadCategories(): void {
    this.categoryService.getByUser(this.loggedUser.id).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.log('Erro ao buscar categorias: ', err),
    });
  }

  public addCategories(): void {
    if (this.categoryForm.invalid) return;

    const newCategories = {
      name: this.categoryForm.value.name,
      color: this.categoryForm.value.color.startsWith('#')
        ? this.categoryForm.value.color
        : `#${this.categoryForm.value.color}`,
      userId: this.loggedUser.id,
    };

    this.categoryService.create(newCategories).subscribe({
      next: () => {
        this.categoryForm.reset({ name: '', color: '#3b82f6' });
        this.loadCategories();
      },
      error: (err) => alert(err.error?.error || 'Erro ao criar categoria.'),
    });
  }

  public logout(): void {
    localStorage.removeItem('userLogado');
    this.router.navigate(['/login']);
  }

  public alterStatusTask(task: any): void {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';

    this.taskService.update(task.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadTask();
      },
      error: (err) => alert(err.error?.error || 'Erro ao atualizar tarefa'),
    });
  }

  public deleteTask(taskId: number): void {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    this.taskService.delete(taskId).subscribe({
      next: () => {
        this.loadTask();
      },
      error: (err) => alert(err.error?.error || 'Erro ao deletar tarefa.'),
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  }

  taskPriorityTranslate(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'ALTA';
      case 'MEDIUM':
        return 'MEDIA';
      default:
        return 'BAIXA';
    }
  }
}
