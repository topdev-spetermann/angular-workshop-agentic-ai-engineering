import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookApiClient } from './book-api-client.service';
import { Book } from './book';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <button routerLink="/" class="text-blue-700 hover:underline mb-6">&larr; Zurück zur Liste</button>

      <ng-container *ngIf="loading; else content">
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"></div>
            <p class="mt-4 text-gray-600">Lade Buch...</p>
          </div>
        </div>
      </ng-container>

      <ng-template #content>
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Konnte Buch nicht laden. Bitte später erneut versuchen.
        </div>

        <div *ngIf="book" class="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-1">
            <img *ngIf="book.cover; else noCover" [src]="book.cover" [alt]="book.title" class="w-full h-auto object-contain bg-gray-100 rounded" />
            <ng-template #noCover>
              <div class="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-500">Kein Cover vorhanden</div>
            </ng-template>
          </div>

          <div class="md:col-span-2 space-y-4">
            <h1 class="text-3xl font-bold text-blue-700">{{ book.title }}</h1>
            <p *ngIf="book.subtitle" class="text-gray-700">{{ book.subtitle }}</p>
            <p class="text-gray-800"><span class="font-medium">Autor:</span> {{ book.author }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p class="text-gray-700"><span class="font-medium">ISBN:</span> {{ book.isbn }}</p>
              <p class="text-gray-700"><span class="font-medium">Verlag:</span> {{ book.publisher }}</p>
              <p class="text-gray-700"><span class="font-medium">Seiten:</span> {{ book.numPages }}</p>
              <p class="text-gray-700"><span class="font-medium">Preis:</span> {{ book.price }}</p>
            </div>

            <div>
              <h2 class="text-xl font-semibold mt-2 mb-1">Beschreibung</h2>
              <p class="text-gray-700 whitespace-pre-line">{{ book.abstract }}</p>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class BookDetailComponent {
  book?: Book;
  loading = true;
  error = false;

  constructor(private route: ActivatedRoute, private api: BookApiClient) {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }
    this.api.getBook(id).subscribe({
      next: (b) => { this.book = b; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }
}


