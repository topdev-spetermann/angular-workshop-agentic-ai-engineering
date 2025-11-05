import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Book } from './book';
import { Paginated } from '../shared/pagination';

@Injectable({ providedIn: 'root' })
export class BookApiClient {
  private readonly apiUrl = 'http://localhost:4730/books';
  private readonly http = inject(HttpClient);

  getBooks(page: number, limit: number, searchTerm?: string): Observable<Paginated<Book>> {
    let params = new HttpParams().set('_page', String(page)).set('_limit', String(limit));

    if (searchTerm) {
      params = params.set('q', searchTerm);
    }

    return this.http.get<Book[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalHeader = response.headers.get('X-Total-Count');
        const total = totalHeader ? Number(totalHeader) : (response.body?.length ?? 0);
        const items = response.body ?? [];
        return { items, total } as Paginated<Book>;
      })
    );
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }
}
