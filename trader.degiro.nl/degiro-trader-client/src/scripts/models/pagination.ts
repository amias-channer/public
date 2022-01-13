export const defaultPageSize: number = 25;

export const defaultPageSizes: ReadonlyArray<number> = Object.freeze<number>([10, 25, 50, 100]);

export const defaultGroupSize: number = 2;

// Pagination model should be updated only using services
export interface Pagination {
    readonly pageSize: number;
    readonly pageSizeStep: number;
    readonly pageNumber: number;
    readonly totalSize: number;
    readonly pagesCount: number;
}
