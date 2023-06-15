/**
 *
 *
 * @export
 * @class CycleGapMetaData
 */
export class CycleGapMetaData {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CycleGapMetaDatas = CycleGapMetaData[];

export default CycleGapMetaData;
