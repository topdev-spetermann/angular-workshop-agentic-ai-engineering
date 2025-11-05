import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookApiClient } from './book-api-client.service';
import { Book } from './book';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <button routerLink="/" class="text-blue-700 hover:underline mb-6">&larr; Zurück zur Liste</button>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"></div>
            <p class="mt-4 text-gray-600">Lade Buch...</p>
          </div>
        </div>
      } @else {
        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            Konnte Buch nicht laden. Bitte später erneut versuchen.
          </div>
        }

        @if (book()) {
          <div class="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1">
              @if (book()!.cover; as cover) {
                <img [src]="cover" [alt]="book()!.title" class="w-full h-auto object-contain bg-gray-100 rounded" />
              } @else {
                <div class="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-500">Kein Cover vorhanden</div>
              }
            </div>

            <div class="md:col-span-2 space-y-4">
              <h1 class="text-3xl font-bold text-blue-700">{{ book()!.title }}</h1>
              @if (book()!.subtitle) {
                <p class="text-gray-700">{{ book()!.subtitle }}</p>
              }
              <p class="text-gray-800"><span class="font-medium">Autor:</span> {{ book()!.author }}</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p class="text-gray-700"><span class="font-medium">ISBN:</span> {{ book()!.isbn }}</p>
                <p class="text-gray-700"><span class="font-medium">Verlag:</span> {{ book()!.publisher }}</p>
                <p class="text-gray-700"><span class="font-medium">Seiten:</span> {{ book()!.numPages }}</p>
                <p class="text-gray-700"><span class="font-medium">Preis:</span> {{ book()!.price }}</p>
              </div>

              <div>
                <h2 class="text-xl font-semibold mt-2 mb-1">Beschreibung</h2>
                <p class="text-gray-700 whitespace-pre-line">{{ book()!.abstract }}</p>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class BookDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(BookApiClient);

  readonly book = signal<Book | undefined>(undefined);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  constructor() {
    this.route.paramMap
      .pipe(
        tap(() => { this.loading.set(true); this.error.set(false); }),
        map(params => params.get('id')),
        switchMap(id => {
          if (!id) {
            this.error.set(true);
            this.loading.set(false);
            return of(undefined as Book | undefined);
          }
          return this.api.getBook(id).pipe(
            catchError(() => {
              this.error.set(true);
              return of(undefined as Book | undefined);
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(b => {
        this.book.set(b);
        this.loading.set(false);
      });
  }
}
