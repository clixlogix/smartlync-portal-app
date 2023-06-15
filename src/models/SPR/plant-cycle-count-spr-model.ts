/**
 *
 *
 * @export
 * @class PlantCycleCountSpr
 */
export class PlantCycleCountSpr {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type PlantCycleCountSprs = PlantCycleCountSpr[];

export default PlantCycleCountSpr;
