/**
 *
 *
 * @export
 * @class UptimeDistribution
 */
export class UptimeDistribution {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type UptimeDistributions = UptimeDistribution[];

export default UptimeDistribution;
