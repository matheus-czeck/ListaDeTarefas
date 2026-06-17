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
import { InputText } from "primeng/inputtext";
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
    ColorPickerModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public loggedUser: any = null;
  public categories: any[] = [];
  public categoryForm!: FormGroup;

  public metrics = { pendentes: 0, concluidas: 0, atrasadas: 0 };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('userLogado');

    if (!userJson) {
      this.logout();
      return;
    }
    this.loggedUser = JSON.parse(userJson);
    this.initCategoryForm();
    this.loadCategories();
  }

  private initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name:['', [Validators.required, Validators.maxLength(15)]],
      color: ['#3b82f6']
    })
  }

  public loadCategories():void{
    this.categoryService.getByUser(this.loggedUser.id).subscribe({
      next: (data)=>{
        this.categories = data;
      },
      error: (err) => console.log('Erro ao buscar categorias: ', err)
    })
  }

  public addCategories():void {
    if(this.categoryForm.invalid) return;

    const newCategories = {
      name: this.categoryForm.value.name,
      color: this.categoryForm.value.color.startsWith('#')?this.categoryForm.value.color: `#${this.categoryForm.value.color}`, 
      userId: this.loggedUser.id
    }

    this.categoryService.create(newCategories).subscribe({
      next: ()=>{
        this.categoryForm.reset({name: '', color: '#3b82f6'});
        this.loadCategories()
      },
      error: (err)=> alert(err.error?.error || 'Erro ao criar categoria.')
    })
  }


  public logout(): void {
    localStorage.removeItem('userLogado');
    this.router.navigate(['/login']);
  }
}
