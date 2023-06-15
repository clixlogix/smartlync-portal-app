/**
 *
 *
 * @export
 * @class ProcessLogSpr
 */
export class ProcessLogSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type ProcessLogSprs = ProcessLogSpr[];

export default ProcessLogSpr;
