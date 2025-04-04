import { Directive, effect, input, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appHighlightCompletedTodo]'
})
export class HighlightCompletedTodoDirective {
  isCompleted = input<boolean>(false);
  el = inject(ElementRef);
  constructor() { }

  styleEffect = effect(() => {
    if (this.isCompleted()) {
      this.el.nativeElement.style.backgroundColor = '#d3f9d8';
      this.el.nativeElement.style.textDecoration = 'line-through';
      this.el.nativeElement.style.color = '#6c757d';
    } else {
      this.el.nativeElement.style.backgroundColor = '#fff';
      this.el.nativeElement.style.textDecoration = 'none';
      this.el.nativeElement.style.color = '#000';
    }
  });

}
