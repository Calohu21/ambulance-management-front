import { Component, computed, input, output, signal } from '@angular/core';

export interface TableColum<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  pipe?: (value: any) => string;
  class?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
  action: (item: T) => void;
  disabled?: (item: T) => boolean;
  hidden?: (item: T) => boolean;
}

type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.component.html',
  styles: ``,
})
export class DataTableComponent<T extends Record<string, any>> {
  data = input.required<T[]>();
  columns = input.required<TableColum<T>[]>();
  actions = input<TableAction<T>[]>();
  loading = input(false);
  clickableRows = input(false);
  emptyMessage = input('No hay datos que mostrar');
  trackBy = input<keyof T | null>(null);

  rowClicked = output<T>();

  private sortColumnCache = signal<string | null>(null);
  readonly sortColumn = this.sortColumnCache.asReadonly();
  private sortDirectionCache = signal<SortDirection>(null);
  readonly sortDirection = this.sortDirectionCache.asReadonly();

  columnCount = computed((): number => {
    let count = this.columns().length;

    if (this.actions() && this.actions()!.length > 0) {
      count++;
    }

    return count;
  });

  sortedData = computed((): T[] => {
    const data = [...this.data()];
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();

    if (!sortCol || !sortDir) {
      return data;
    }

    return data.sort((a, b) => {
      const aVal = this.getNestedValue(a, sortCol);
      const bVal = this.getNestedValue(b, sortCol);

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;

      return sortDir === 'asc' ? comparison : -comparison;
    });
  });

  getNestedValue(obj: any, key: string | keyof T) {
    const keys = String(key).split('.');
    let value = obj;

    for (const key of keys) {
      value = value?.[key];

      if (value === undefined) break;
    }

    return value;
  }

  onSort(columnKey: string | keyof T) {
    const key = String(columnKey);

    if (this.sortColumn() === key) {
      if (this.sortDirection() === 'asc') {
        this.sortDirectionCache.set('desc');
      } else if (this.sortDirection() === 'desc') {
        this.sortColumnCache.set(null);
        this.sortDirectionCache.set(null);
      }
    } else {
      this.sortColumnCache.set(key);
      this.sortDirectionCache.set('asc');
    }
  }

  onRowClick(item: T) {
    if (this.clickableRows()) {
      this.rowClicked.emit(item);
    }
  }

  formatValue(item: T, colum: TableColum<T>): string {
    const value = this.getNestedValue(item, colum.key);

    if (colum.pipe) {
      return colum.pipe(value);
    }

    return value != null ? String(value) : '-';
  }

  getVisibleActions(item: T): TableAction<T>[] {
    return (
      this.actions()?.filter((action) => {
        return !action.hidden || !action.hidden(item);
      }) || []
    );
  }

  isActionDisabled(action: TableAction<T>, item: T): boolean {
    return action.disabled ? action.disabled(item) : false;
  }

  trackByFn(index: number, item: T): any {
    if (this.trackBy()) {
      return item[this.trackBy()!];
    }
    return index;
  }
}
