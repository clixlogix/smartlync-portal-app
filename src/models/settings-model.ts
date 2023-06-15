/**
 *
 *
 * @export
 * @class Settings
 */
export class Settings {
    id: string;
    type: string;
    operationName: string;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
    from?: string;
    to?: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, type, operationName, startTime, endTime, startDate, endDate, from, to } =
            o || ({} as any);

        this.id = id;
        this.type = type;
        this.operationName = operationName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startDate = startDate;
        this.endDate = endDate;
        this.from = from;
        this.to = to;
    }
}

export type Settingss = Settings[];

export default Settings;
