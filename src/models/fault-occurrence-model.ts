/**
 *
 *
 * @export
 * @class FaultOccurrence
 */
export class FaultOccurrence {
    protected id: string;
    public faultCode: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, faultCode = '' } = o || ({} as any);

        this.id = id;
        this.faultCode = faultCode;
    }
}

export type FaultOccurrences = FaultOccurrence[];

export default FaultOccurrence;
