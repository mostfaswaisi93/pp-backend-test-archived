export interface Pagination {
  pagonationOptions?: {
    limit?: number;
    offset?: number;
  };

  filters?: any;
  sort?: any;
}

export interface FindAndCount<T> {
  count: number;
  rows: T[];
}
