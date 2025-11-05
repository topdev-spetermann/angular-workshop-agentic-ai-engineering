import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Book } from '../book';

@Component({
  selector: 'app-book-card',
  template: `
    <article class="card" tabindex="0" aria-roledescription="Draggable book card">
      <div class="title">{{ book().title }}</div>
      <div class="author">{{ book().author }}</div>
    </article>
  `,
  styles: [`
    .card { background: white; border: 1px solid #ddd; border-radius: 6px; padding: 0.5rem 0.75rem; cursor: grab; }
    .card:focus { outline: 2px solid #3b82f6; outline-offset: 2px; }
    .title { font-weight: 600; }
    .author { color: #666; font-size: 0.9rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookCardComponent {
  readonly book = input.required<Book>();
}


