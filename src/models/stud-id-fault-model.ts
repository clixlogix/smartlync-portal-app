/**
 *
 *
 * @export
 * @class StudIdFault
 */
export class StudIdFault {
    protected id: string;
    public studType: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, studType = '' } = o || ({} as any);

        this.id = id;
        this.studType = studType;
    }
}

export type StudIdFaults = StudIdFault[];

export default StudIdFault;
