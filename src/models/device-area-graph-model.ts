/**
 *
 *
 * @export
 * @class DeviceAreaGraph
 */
export class DeviceAreaGraph {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type DeviceAreaGraphs = DeviceAreaGraph[];

export default DeviceAreaGraph;
