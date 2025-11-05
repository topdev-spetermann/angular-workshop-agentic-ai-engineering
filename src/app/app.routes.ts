import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'books/:id', loadComponent: () => import('./books/book-detail.component').then(m => m.BookDetailComponent) },
  { path: '**', redirectTo: '' }
];
