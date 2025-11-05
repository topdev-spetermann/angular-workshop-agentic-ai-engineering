import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';
import { BookItemComponent } from './book-item.component';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, BookItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <h1 class="text-3xl font-bold mb-10 text-blue-700 border-b pb-4 border-gray-200">Book Collection</h1>

      <div class="mb-6">
        <div class="flex items-center border-b-2 border-gray-300 py-2">
          <input
            type="text"
            [value]="search()"
            (input)="onSearchInput($event)"
            placeholder="Search for books..."
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          @if (search()) {
            <button
              (click)="clearSearch()"
              class="flex-shrink-0 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-pulse flex flex-col items-center">
            <div
              class="h-16 w-16 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-gray-200 border-l-gray-200 animate-spin"
            ></div>
            <p class="mt-4 text-gray-600">Loading books...</p>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          @for (book of books(); track trackById($index, book); let i = $index) {
            <app-book-item [book]="book"></app-book-item>
          }

          @if (books().length === 0) {
            <div
              class="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p class="text-xl font-medium text-gray-600 mb-2">
                {{ search() ? 'No books match your search' : 'No books available' }}
              </p>
              <p class="text-gray-500">
                {{ search() ? 'Try different search terms or clear the search' : 'Check back later' }}
              </p>
              @if (search()) {
                <button
                  (click)="clearSearch()"
                  class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Clear Search
                </button>
              }
            </div>
          }
        </div>

        <!-- Paginator -->
        <nav class="mt-8 flex items-center justify-between" role="navigation" aria-label="Pagination">
          <div class="text-sm text-gray-600">Seite {{ page() }} von {{ pageCount() }} ({{ total() }} Treffer)</div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 rounded border text-sm disabled:opacity-50"
              (click)="goToFirst()"
              [disabled]="page() === 1"
              aria-label="Erste Seite"
            >
              Erste
            </button>
            <button
              class="px-3 py-1 rounded border text-sm disabled:opacity-50"
              (click)="goToPrev()"
              [disabled]="page() === 1"
              aria-label="Vorherige Seite"
            >
              Zurück
            </button>

            <!-- Seitenzahlen mit Nachbarn und Ellipsen -->
            @for (p of visiblePages(); track p) {
              @if (p === '…') {
                <span class="px-2 text-gray-500 select-none" aria-hidden="true">…</span>
              } @else {
                <button
                  class="px-3 py-1 rounded border text-sm"
                  [class.bg-blue-600]="p === page()"
                  [class.text-white]="p === page()"
                  [attr.aria-current]="p === page() ? 'page' : null"
                  (click)="goToPage(p)"
                >
                  {{ p }}
                </button>
              }
            }

            <button
              class="px-3 py-1 rounded border text-sm disabled:opacity-50"
              (click)="goToNext()"
              [disabled]="page() === pageCount()"
              aria-label="Nächste Seite"
            >
              Weiter
            </button>
            <button
              class="px-3 py-1 rounded border text-sm disabled:opacity-50"
              (click)="goToLast()"
              [disabled]="page() === pageCount()"
              aria-label="Letzte Seite"
            >
              Letzte
            </button>

            <label class="ml-4 text-sm text-gray-700" for="pageSize">Pro Seite:</label>
            <select
              id="pageSize"
              class="ml-2 border rounded px-2 py-1 text-sm"
              [value]="pageSize()"
              (change)="onPageSizeChange($event)"
              aria-label="Seitengröße auswählen"
            >
              <option [value]="6">6</option>
              <option [value]="12">12</option>
              <option [value]="24">24</option>
              <option [value]="48">48</option>
            </select>
          </div>
        </nav>
      }
    </div>
  `
})
export class BookListComponent implements OnInit {
  private readonly api = inject(BookApiClient);

  readonly page = signal(1);
  readonly pageSize = signal(12);
  readonly search = signal('');
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  readonly books = signal<Book[]>([]);

  private searchDebounceHandle: number | undefined;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getBooks(this.page(), this.pageSize(), this.search() || undefined).subscribe({
      next: result => {
        this.books.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error fetching books:', err);
        this.loading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.page.set(1);
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
    }
    this.searchDebounceHandle = globalThis.setTimeout(() => this.load(), 300);
  }

  clearSearch(): void {
    this.search.set('');
    this.page.set(1);
    this.load();
  }

  goToFirst(): void {
    if (this.page() > 1) {
      this.page.set(1);
      this.load();
    }
  }
  goToPrev(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
      this.load();
    }
  }
  goToNext(): void {
    if (this.page() < this.pageCount()) {
      this.page.set(this.page() + 1);
      this.load();
    }
  }
  goToLast(): void {
    if (this.page() < this.pageCount()) {
      this.page.set(this.pageCount());
      this.load();
    }
  }
  goToPage(p: number): void {
    if (p !== this.page()) {
      this.page.set(p);
      this.load();
    }
  }

  onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(size);
    this.page.set(1);
    this.load();
  }

  visiblePages(): (number | '…')[] {
    const current = this.page();
    const last = this.pageCount();
    const delta = 1; // Nachbarn links/rechts
    const pages: number[] = [];
    for (let p = Math.max(1, current - delta); p <= Math.min(last, current + delta); p++) {
      pages.push(p);
    }
    if (!pages.includes(1)) pages.unshift(1);
    if (!pages.includes(last)) pages.push(last);
    const result: (number | '…')[] = [];
    let prev = 0;
    for (const p of pages) {
      if (prev && p - prev > 1) result.push('…');
      result.push(p);
      prev = p;
    }
    return result;
  }

  trackById(index: number, book: Book): string {
    return book.id;
  }
}
