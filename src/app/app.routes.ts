import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  {
    path: 'books/kanban',
    loadComponent: () => import('./books/kanban/book-kanban.component').then(m => m.BookKanbanComponent)
  },
  { path: 'books/new', loadComponent: () => import('./books/book-create.component').then(m => m.BookCreateComponent) },
  { path: 'books/:id', loadComponent: () => import('./books/book-detail.component').then(m => m.BookDetailComponent) },
  { path: '**', redirectTo: '' }
];
