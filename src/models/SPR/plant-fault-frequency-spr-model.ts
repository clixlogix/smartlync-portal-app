/**
 *
 *
 * @export
 * @class PlantFaultFrequencySpr
 */
export class PlantFaultFrequencySpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type PlantFaultFrequencySprs = PlantFaultFrequencySpr[];

export default PlantFaultFrequencySpr;
