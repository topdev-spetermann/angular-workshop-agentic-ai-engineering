import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LocalStorageService } from '../../shared/local-storage.service';
import { Book } from '../book';
import { BookApiClient } from '../book-api-client.service';
import { BookCardComponent } from './book-card.component';

export type BookStatus = 'to-read' | 'reading' | 'completed';

export interface KanbanColumn {
  id: BookStatus;
  title: string;
  bookIds: string[];
}

export interface KanbanBoardState {
  columns: KanbanColumn[];
}

const LS_KEY = 'book-kanban-state:v1';

@Component({
  selector: 'app-book-kanban',
  imports: [DragDropModule, BookCardComponent],
  template: `
    <section class="board">
      @for (col of columns(); track col.id) {
        <div
          class="column"
          cdkDropList
          [id]="col.id"
          [cdkDropListData]="col.bookIds"
          [cdkDropListConnectedTo]="connectedLists()"
          (cdkDropListDropped)="drop($event)"
          role="list"
          [attr.aria-label]="col.title"
        >
          <header class="column-header">
            <h3 class="column-title">{{ col.title }}</h3>
            <span class="badge" [attr.aria-label]="'Count: ' + col.bookIds.length">{{ col.bookIds.length }}</span>
          </header>

          @for (id of col.bookIds; track id) {
            <app-book-card cdkDrag [book]="bookById(id)!"></app-book-card>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .board {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(3, 1fr);
      }
      .column {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 0.75rem;
        min-height: 200px;
      }
      .column-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .column-title {
        margin: 0;
        font-weight: 600;
      }
      .badge {
        background: #e5e7eb;
        color: #111827;
        border-radius: 9999px;
        padding: 0.1rem 0.5rem;
        font-size: 0.8rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookKanbanComponent {
  private readonly storage = inject(LocalStorageService);
  private readonly api = inject(BookApiClient);

  readonly books = signal<Book[]>([]);
  readonly board = signal<KanbanBoardState>(this.loadBoard());
  readonly columns = computed(() => this.board().columns);
  readonly connectedLists = computed(() => this.columns().map(c => c.id));

  ngOnInit(): void {
    this.api.getBooks(1, 1000).subscribe({
      next: result => {
        this.books.set(result.items);

        const hasAnyIds = this.board().columns.some(c => c.bookIds.length > 0);

        if (!hasAnyIds) {
          const allIds = result.items.map(b => b.id);
          this.board.update(b => ({
            columns: [
              { id: 'to-read', title: 'To Read', bookIds: allIds },
              { id: 'reading', title: 'Reading', bookIds: [] },
              { id: 'completed', title: 'Completed', bookIds: [] }
            ]
          }));
          this.persist();
        }
      },
      error: err => {
        console.error('Error loading books for Kanban:', err);
      }
    });
  }

  bookById = (id: string) => this.books().find(b => b.id === id);

  drop(event: CdkDragDrop<string[]>) {
    const { previousContainer, container, previousIndex, currentIndex } = event;

    this.board.update(board => {
      const src = board.columns.find(c => c.bookIds === previousContainer.data)!;
      const dst = board.columns.find(c => c.bookIds === container.data)!;

      if (src === dst) {
        moveItemInArray(src.bookIds, previousIndex, currentIndex);
      } else {
        transferArrayItem(src.bookIds, dst.bookIds, previousIndex, currentIndex);
      }
      return { ...board };
    });

    this.persist();
  }

  private loadBoard(): KanbanBoardState {
    const persisted = this.storage.getItem<KanbanBoardState>(LS_KEY);
    return (
      persisted ?? {
        columns: [
          { id: 'to-read', title: 'To Read', bookIds: [] },
          { id: 'reading', title: 'Reading', bookIds: [] },
          { id: 'completed', title: 'Completed', bookIds: [] }
        ]
      }
    );
  }

  private persist(): void {
    this.storage.setItem(LS_KEY, this.board());
  }
}
