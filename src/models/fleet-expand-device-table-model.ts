/**
 *
 *
 * @export
 * @class FleetExpandDeviceTable
 */
export class FleetExpandDeviceTable {
    protected id: string;
    public fault?: string;
    public description?: string;
    public time?: string;
    public faultCount?: number;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
        this.fault = o?.fault;
        this.description = o?.description;
        this.time = o?.time;
        this.faultCount = o?.faultCount;
    }
}

export type FleetExpandDeviceTables = FleetExpandDeviceTable[];

export default FleetExpandDeviceTable;
