/**
 *
 *
 * @export
 * @class FixedRange
 */
export class FixedRange {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type FixedRanges = FixedRange[];

export default FixedRange;
