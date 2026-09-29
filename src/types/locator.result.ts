export type LocatorStrategy =
    | 'id'
    | 'data-testid'
    | 'name'
    | 'aria-label';

export interface LocatorResult {
    healed: boolean;
    originalSelector: string;
    newSelector: string;
    strategyUsed?: LocatorStrategy;
    timestamp: string;
}
