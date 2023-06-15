/**
 *
 *
 * @export
 * @class CycleGapTempo
 */
export class CycleGapTempo {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type CycleGapTempos = CycleGapTempo[];

export default CycleGapTempo;
