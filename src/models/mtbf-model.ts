/**
 *
 *
 * @export
 * @class Mtbf
 */
export class Mtbf {
    protected id?: string;
    deviceNameOutlet: string;
    faultCode?: string;
    mtbf: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, deviceNameOutlet = '', faultCode = '', mtbf = '' } = o || ({} as any);

        this.id = id;
        this.deviceNameOutlet = deviceNameOutlet;
        this.faultCode = faultCode;
        this.mtbf = mtbf;
    }
}

export type Mtbfs = Mtbf[];

export default Mtbf;
