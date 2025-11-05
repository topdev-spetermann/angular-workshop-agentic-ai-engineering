import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookApiClient } from './book-api-client.service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-book-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-blue-700">Neues Buch anlegen</h1>
        <a routerLink="/" class="text-blue-700 hover:underline" aria-label="Zurück zur Liste">&larr; Zurück</a>
      </div>

      @if (error()) {
        <div class="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Erstellen fehlgeschlagen. Bitte später erneut versuchen.
        </div>
      }

      <form class="bg-white rounded-xl shadow p-6 grid grid-cols-1 gap-6" [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="isbn" class="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              id="isbn"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="z.B. 978-3-16-148410-0"
              formControlName="isbn"
              [class.border-red-500]="showError('isbn')"
            />
            @if (showError('isbn')) {
              <p class="mt-1 text-sm text-red-600">Bitte eine gültige ISBN angeben.</p>
            }
          </div>

          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
            <input
              id="title"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Buchtitel"
              formControlName="title"
              [class.border-red-500]="showError('title')"
            />
            @if (showError('title')) {
              <p class="mt-1 text-sm text-red-600">Titel ist erforderlich (mind. 3 Zeichen).</p>
            }
          </div>

          <div>
            <label for="subtitle" class="block text-sm font-medium text-gray-700">Untertitel</label>
            <input
              id="subtitle"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Optional"
              formControlName="subtitle"
            />
          </div>

          <div>
            <label for="author" class="block text-sm font-medium text-gray-700">Autor</label>
            <input
              id="author"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Autor:in"
              formControlName="author"
              [class.border-red-500]="showError('author')"
            />
            @if (showError('author')) {
              <p class="mt-1 text-sm text-red-600">Autor ist erforderlich.</p>
            }
          </div>

          <div>
            <label for="publisher" class="block text-sm font-medium text-gray-700">Verlag</label>
            <input
              id="publisher"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Verlag"
              formControlName="publisher"
              [class.border-red-500]="showError('publisher')"
            />
            @if (showError('publisher')) {
              <p class="mt-1 text-sm text-red-600">Verlag ist erforderlich.</p>
            }
          </div>

          <div>
            <label for="numPages" class="block text-sm font-medium text-gray-700">Seiten</label>
            <input
              id="numPages"
              type="number"
              min="1"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Anzahl Seiten"
              formControlName="numPages"
              [class.border-red-500]="showError('numPages')"
            />
            @if (showError('numPages')) {
              <p class="mt-1 text-sm text-red-600">Bitte eine Seitenzahl ≥ 1 angeben.</p>
            }
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Preis</label>
            <input
              id="price"
              type="text"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="z.B. 12,99 oder 12.99"
              formControlName="price"
              [class.border-red-500]="showError('price')"
            />
            @if (showError('price')) {
              <p class="mt-1 text-sm text-red-600">Bitte einen gültigen Preis angeben.</p>
            }
          </div>

          <div>
            <label for="cover" class="block text-sm font-medium text-gray-700">Cover-URL</label>
            <input
              id="cover"
              type="url"
              class="mt-1 block w-full border rounded px-3 py-2"
              placeholder="https://..."
              formControlName="cover"
              [class.border-red-500]="showError('cover')"
            />
            @if (showError('cover')) {
              <p class="mt-1 text-sm text-red-600">Bitte eine gültige URL angeben.</p>
            }
          </div>
        </div>

        <div>
          <label for="abstract" class="block text-sm font-medium text-gray-700">Beschreibung</label>
          <textarea
            id="abstract"
            rows="5"
            class="mt-1 block w-full border rounded px-3 py-2"
            placeholder="Kurzbeschreibung"
            formControlName="abstract"
            [class.border-red-500]="showError('abstract')"
          ></textarea>
          @if (showError('abstract')) {
            <p class="mt-1 text-sm text-red-600">Beschreibung ist erforderlich (mind. 10 Zeichen).</p>
          }
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <a routerLink="/" class="px-4 py-2 rounded border text-gray-700">Abbrechen</a>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            [disabled]="form.invalid || submitting()"
            aria-label="Buch speichern"
          >
            @if (submitting()) {
              Speichere...
            } @else {
              Speichern
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class BookCreateComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(BookApiClient);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal(false);

  private readonly pricePattern = /^\d+(?:[.,]\d{2})?$/;
  private readonly urlPattern = /^https?:\/\/.+/;

  readonly form = this.fb.group({
    isbn: this.fb.control('', { validators: [Validators.required] }),
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    subtitle: this.fb.control(''),
    author: this.fb.control('', { validators: [Validators.required] }),
    publisher: this.fb.control('', { validators: [Validators.required] }),
    numPages: this.fb.control(1, { validators: [Validators.required, Validators.min(1)] }),
    price: this.fb.control('', { validators: [Validators.required, Validators.pattern(this.pricePattern)] }),
    cover: this.fb.control('', { validators: [Validators.pattern(this.urlPattern)] }),
    abstract: this.fb.control('', { validators: [Validators.required, Validators.minLength(10)] }),
    userId: this.fb.control(1, { validators: [Validators.required] })
  });

  showError(controlName: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[controlName];
    return c.invalid && (c.dirty || c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(false);

    const payload = this.form.getRawValue();

    this.api.createBook(payload).subscribe({
      next: () => {
        this.toast.show('Buch erfolgreich erstellt');
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.error.set(true);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}
