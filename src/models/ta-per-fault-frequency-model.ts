/**
 *
 *
 * @export
 * @class TaPerFaultFrequency
 */
export class TaPerFaultFrequency {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type TaPerFaultFrequencys = TaPerFaultFrequency[];

export default TaPerFaultFrequency;
