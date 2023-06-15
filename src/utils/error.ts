/**
 *
 * @export
 * @class CustomError
 * @extends {Error}
 */
export class CustomError extends Error {
    public message: string;
    public data?: any;
    public name: string = 'error';

    constructor(params: { name: string; message: string; data?: any }) {
        super(params.message);

        this.name = params.name;
        this.message = params.message;
        this.data = params.data;
    }
}
