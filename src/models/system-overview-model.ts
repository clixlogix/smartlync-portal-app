/**
 *
 *
 * @export
 * @class SystemOverview
 */
export class SystemOverview {
    protected id?: string;
    deviceName: string;
    ta?: number;
    cycles?: number;
    mttr?: number;
    mtbf?: number;
    faults?: number;
    line?: string;
    stationName?: string;
    deviceHealth?: number;

    // view model attribute
    hidden?: boolean;
    pinned?: boolean;

    constructor(o?: any) {
        const { id = `1-${Math.random()}`, deviceName = '' } = o || ({} as any);

        this.id = id;
        this.deviceName = deviceName;
        this.ta = parseFloat(`${o.ta || o.avg_ta || 0.0}`);
        this.cycles = parseInt(`${o.cycles || 0}`);
        this.mttr = parseFloat(`${o.mttr || o.avg_mttr || 0.0}`);
        this.mtbf = parseFloat(`${o.mtbf || o.avg_mtbf || 0.0}`);
        this.faults = parseInt(`${o.faults || 0}`);
        this.deviceHealth = parseFloat(`${o.deviceHealth || 100}`);

        if (/\s/.test(deviceName)) {
            const [line = '', stationName = ''] = deviceName.split(' ');
            this.line = line;
            this.stationName = stationName;
        } else {
            this.line = o?.line;
            this.stationName = o?.stationName;
        }

        this.hidden = !!o.hidden;
        this.pinned = !!o.pinned;
    }
}

export type SystemOverviews = SystemOverview[];

export default SystemOverview;
