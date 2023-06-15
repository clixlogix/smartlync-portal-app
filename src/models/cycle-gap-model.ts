/**
 *
 *
 * @export
 * @class CycleGap
 */
import { Filters, FilterNames } from 'models';
export class CycleGap {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CycleGaps = CycleGap[];

export type CycleGapLocalFilter = {
    [FilterNames.studId]?: string;
    [FilterNames.outletNo]?: string;
    [FilterNames.feederNo]?: string;
    wip?: boolean;
};

export type CycleGapFilters = {
    filter: Filters;
    localFilters: CycleGapLocalFilter;
};

export default CycleGap;
