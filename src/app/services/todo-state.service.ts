import { Injectable, signal } from '@angular/core';
import { Todo, TodoState, TodoAction } from '../model/todos.type';
import { TodosService } from './todos.service';
import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  private todoService = inject(TodosService);
  
  // Estado privado usando un signal
  private state = signal<TodoState>({
    todos: [],
    loading: false,
    error: null
  });

  // Selectores computados (getters) para acceder al estado
  todos = computed(() => this.state().todos);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  
  // Método para aplicar una acción al estado
  dispatch(action: TodoAction) {
    switch (action.type) {
      case 'ADD_TODO':
        this.state.update(state => ({
          ...state,
          todos: [...state.todos, action.payload]
        }));
        break;
      case 'DELETE_TODO':
        this.state.update(state => ({
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        }));
        break;
      case 'TOGGLE_TODO':
        this.state.update(state => ({
          ...state,
          todos: state.todos.map(todo => 
            todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
          )
        }));
        break;
      case 'LOAD_TODOS':
        this.state.update(state => ({
          ...state,
          todos: action.payload,
          loading: false
        }));
        break;
      case 'LOADING_TODOS':
        this.state.update(state => ({
          ...state,
          loading: true,
          error: null
        }));
        break;
      case 'ERROR_TODOS':
        this.state.update(state => ({
          ...state,
          loading: false,
          error: action.payload
        }));
        break;
    }
  }
  
  // Métodos de acción para cargar todos
  loadTodos() {
    // Establecer el estado de carga
    this.dispatch({ type: 'LOADING_TODOS' });
    
    this.todoService.getTodosFromApi().pipe(
      catchError((err: HttpErrorResponse) => {
        this.dispatch({ 
          type: 'ERROR_TODOS', 
          payload: err.message 
        });
        throw err;
      })
    ).subscribe((todos: Array<Todo>) => {
      this.dispatch({ 
        type: 'LOAD_TODOS', 
        payload: todos 
      });
    });
  }
  
  // Métodos de acción para añadir, eliminar o cambiar el estado de los todos
  addTodo(todo: Todo) {
    this.dispatch({ type: 'ADD_TODO', payload: todo });
  }
  
  deleteTodo(id: number) {
    this.dispatch({ type: 'DELETE_TODO', payload: id });
  }
  
  toggleTodo(id: number) {
    this.dispatch({ type: 'TOGGLE_TODO', payload: id });
  }
} 