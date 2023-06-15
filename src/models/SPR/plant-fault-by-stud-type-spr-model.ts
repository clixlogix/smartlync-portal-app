/**
 *
 *
 * @export
 * @class PlantFaultByStudTypeSpr
 */
export class PlantFaultByStudTypeSpr {
    protected id: string;
    public studType: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, studType = '' } = o || ({} as any);

        this.id = id;
        this.studType = studType;
    }
}

export type PlantFaultByStudTypeSprs = PlantFaultByStudTypeSpr[];

export default PlantFaultByStudTypeSpr;
