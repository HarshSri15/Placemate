export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult {
  skip: number;
  limit: number;
  sort: Record<string, 1 | -1>;
  page: number;
}

export const getPagination = (options: PaginationOptions): PaginationResult => {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;
  
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortOrder };
  
  return {
    skip,
    limit,
    sort,
    page,
  };
};
