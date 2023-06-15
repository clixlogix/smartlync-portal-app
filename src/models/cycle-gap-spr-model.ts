/**
 *
 *
 * @export
 * @class CycleGapSpr
 */
import { Filters, FilterNames } from 'models';
export class CycleGapSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CycleGapSprs = CycleGapSpr[];

export type CycleGapSprLocalFilter = {
    [FilterNames.studId]?: string;
    [FilterNames.outletNo]?: string;
};

export type CycleGapSprFilters = {
    filter: Filters;
    localFilters: CycleGapSprLocalFilter;
};

export default CycleGapSpr;
