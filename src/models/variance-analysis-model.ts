/**
 *
 *
 * @export
 * @class VarianceAnalysis
 */
export class VarianceAnalysis {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type VarianceAnalysiss = VarianceAnalysis[];

export default VarianceAnalysis;
