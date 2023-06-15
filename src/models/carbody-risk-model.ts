/**
 *
 *
 * @export
 * @class CarbodyRisk
 */
export class CarbodyRisk {
    protected id?: string;
    carBody?: string;
    studId?: string;
    risk: number;
    weldId?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, carBody = '', studId = '', risk = 0, weldId = '' } = o || ({} as any);

        this.id = id;
        this.carBody = carBody;
        this.studId = studId;
        this.risk = risk;
        this.weldId = weldId;
    }
}

export type CarbodyRisks = CarbodyRisk[];

export default CarbodyRisk;
