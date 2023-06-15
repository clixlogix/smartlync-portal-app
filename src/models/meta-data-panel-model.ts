/**
 *
 *
 * @export
 * @class MetaDataPanel
 */
export class MetaDataPanel {
    protected id: string;

    constructor(o?: any) {
        const { id = `1-${Math.random()}` } = o || ({} as any);

        this.id = id;
    }
}

export type MetaDataPanels = MetaDataPanel[];

export default MetaDataPanel;
