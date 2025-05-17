import { Component, inject, OnInit, signal } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { Todo } from '../model/todos.type';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { FilterTodosPipe } from '../pipes/filter-todos.pipe';
import { TodoStateService } from '../services/todo-state.service';

@Component({
  selector: 'app-todos',
  imports: [CommonModule, TodoItemComponent, FormsModule, FilterTodosPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  todoStateService = inject(TodoStateService);
  searchTerm = signal('');
  
  // Getter y setter para facilitar el enlace bidireccional con un signal
  get searchTermValue(): string {
    return this.searchTerm();
  }
  
  set searchTermValue(value: string) {
    this.searchTerm.set(value);
  }

  ngOnInit(): void {
    // Usar el servicio de estado para cargar los todos
    this.todoStateService.loadTodos();
  }

  updateTodoItem(todoItem: Todo) {
    // Usar el servicio de estado para cambiar el estado del todo
    this.todoStateService.toggleTodo(todoItem.id);
  }

  // Método para añadir un nuevo todo (ejemplos de uso de otras acciones)
  addTodo(title: string) {
    if (!title.trim()) return; // No agregar todos vacíos
    
    const newTodo: Todo = {
      id: Date.now(), // Generar ID único temporal
      title: title,
      completed: false,
      userId: 1 // Valor predeterminado para ejemplo
    };
    this.todoStateService.addTodo(newTodo);
  }

  // Método para eliminar un todo
  deleteTodo(id: number) {
    this.todoStateService.deleteTodo(id);
  }
}
