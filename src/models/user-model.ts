import { Role, Roles } from 'models';

export enum SmartLyncRoles {
    SmartLyncGroupAdmin = 'SmartLync Group Admin',
    SmartLyncUser = 'SmartLync-USER',
    SmartLyncPro = 'SmartLync-PRO',
    SmartLyncDeveloper = 'SmartLync Product Dev',
    SmartLyncNobody = 'SmartLync-NOBODY',
}

export enum AuthRole {
    Administrator = 'Administrator',
    GroupAdmin = 'GroupAdmin',
    Manager = 'Manager',
    Technician = 'Technician',
    User = 'User',
    Guest = 'Guest',
}
export type AuthRoles = Array<AuthRole>;

export enum AvailabilityStatus {
    Online = 'Online',
    Away = 'Away',
    Busy = 'Busy',
    InMeeting = 'In Meeting',
    DND = 'Do Not Disturb',
    Offline = 'Offline',
}

export class User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    enabled?: boolean;
    roles?: Roles;
    timeZone?: string;
    locale?: string;
    avatar?: string;
    availabilityStatus?: AvailabilityStatus;

    designation: string;
    operationAnalysis: number;
    profilePic: 'Pic001.png';
    projectMap: string;
    projectOverview: string;
    projectPerformance: string;
    reports: number;
    role: string;
    roleIdentifier: string;
    stationStatus: number;

    extraData: any = {};
    userId?: string;

    constructor(props: any = {}) {
        const p = typeof props === 'string' ? ({ id: props } as any) : props;
        let {
            id = props?.userName,
            userName,
            firstName = props?.FullName?.split(' ')[0],
            lastName = props?.FullName?.split(' ')[1],
            phone,
            email,
            enabled,
            roles = [],
            timeZone = 'Etc/GMT-5',
            locale = 'en',
            avatar = 'Pic001.png',
            availabilityStatus = AvailabilityStatus.Offline,
            designation,
            operationAnalysis,
            profilePic = 'Pic001.png',
            projectMap,
            projectOverview,
            projectPerformance,
            reports,
            role,
            roleIdentifier,
            stationStatus,

            extraData = {},
            userId,
        } = p;

        this.id = id || userId;
        this.avatar = avatar;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles.map((role: Role) => new Role(role));
        this.timeZone = timeZone;
        this.locale = locale;
        this.avatar = props.avatar;
        this.availabilityStatus = availabilityStatus;
        this.designation = designation;
        this.operationAnalysis = operationAnalysis;

        this.profilePic = profilePic;
        this.projectMap = projectMap;
        this.projectOverview = projectOverview;
        this.projectPerformance = projectPerformance;
        this.reports = reports;
        this.role = role;
        this.roleIdentifier = roleIdentifier;
        this.stationStatus = stationStatus;
        this.userId = userId || id;
        this.extraData = { ...this.extraData, ...extraData, ...props };
    }

    /**
     * @description
     * @readonly
     * @type {string}
     * @memberof User
     */
    public get name(): string {
        return this.fullName;
    }

    /**
     * @description
     * @readonly
     * @type {string}
     * @memberof User
     */
    public get initials(): string {
        let initials = '';

        if (this.fullName) {
            initials = this.fullName
                .split(' ')
                .map((w) => w[0])
                .join('')
                .toUpperCase();
        }

        return initials;
    }

    /**
     * @description
     * @readonly
     * @type {string}
     * @memberof User
     */
    public get fullName(): string {
        // @ts-ignore
        const { firstName = '', lastName, userName = '' } = this;

        return [firstName, lastName].filter((n) => n).join(' ') || userName;
    }
}

export default User;
