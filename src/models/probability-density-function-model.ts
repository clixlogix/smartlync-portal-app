/**
 *
 *
 * @export
 * @class ProbabilityDensityFunction
 */
export class ProbabilityDensityFunction {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type ProbabilityDensityFunctions = ProbabilityDensityFunction[];

export default ProbabilityDensityFunction;
