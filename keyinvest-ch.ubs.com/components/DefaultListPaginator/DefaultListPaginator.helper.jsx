import { pathOrArray } from '../../utils/typeChecker';

export const DEFAULT_ALLOWED_ROWS_PER_PAGE = [10, 20, 50, 100];
export const getPageSizeOptions = (data) => pathOrArray(
  DEFAULT_ALLOWED_ROWS_PER_PAGE,
  ['allowedRowsPerPage'],
)(data).map((el) => String(el));
