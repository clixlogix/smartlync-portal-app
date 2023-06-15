/**
 *
 *
 * @export
 * @class FaultFrequency
 */
// export class FaultFrequency {
//     protected id: string;

//     constructor(o?: any) {
//         const { id = `1-${Math.random()}` } = o || ({} as any);

//         this.id = id;
//     }
// }

export interface FaultFrequency {
    faultCode?: string;
    occurrences?: string;
}

export type FaultFrequencys = FaultFrequency[];

export default FaultFrequency;
