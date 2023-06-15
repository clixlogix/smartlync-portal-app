export class Role {
    id: string;
    name: string;

    constructor(props: any = {}) {
        this.id = props.id;
        this.name = props.name;
    }
}

export type Roles = Role[];
