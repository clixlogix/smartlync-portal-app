/**
 *
 *
 * @export
 * @class PlantFaultByOccurenceSpr
 */
export class PlantFaultByOccurenceSpr {
    protected id: string;
    public faultCode: string;
    constructor(o?: any) {
        const { id = `1-${Math.random()}`, faultCode = '' } = o || ({} as any);

        this.id = id;
        this.faultCode = faultCode;
    }
}

export type PlantFaultByOccurenceSprs = PlantFaultByOccurenceSpr[];

export default PlantFaultByOccurenceSpr;
