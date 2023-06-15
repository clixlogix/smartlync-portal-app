import { User } from 'models';

/**
 *
 *
 * @export
 * @interface AuthLogin
 */
export interface AuthLogin {
    /**
     * @type {string}
     * @memberOf AuthLogin
     */
    username?: string;

    /**
     * @type {string}
     * @memberOf AuthLogin
     */
    password?: string;
}

/**
 *
 *
 * @export
 * @class Auth
 */
export class Auth {
    /**
     * @type {string}
     * @memberOf Auth
     */
    id: string;

    /**
     * @type {User}
     * @memberOf Auth
     */
    user: User;

    /**
     * @type {string}
     * @memberOf Auth
     */
    token: string;

    /**
     * @type {string}
     * @memberOf Auth
     */
    jwtToken: string;

    /**
     * Creates an instance of Auth.
     * @param {*} [props={}]
     *
     * @memberOf Auth
     */
    constructor(props: any = {}) {
        const p = typeof props === 'string' ? ({ id: props } as any) : props;
        const { id, user, token, jwtToken } = p;

        this.id = id;
        this.user = user ? new User(user) : user;
        this.token = token;
        this.jwtToken = jwtToken;
    }
}

export default User;
