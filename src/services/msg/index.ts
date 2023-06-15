export * from './msg-action';
export * from './msg-selectors';

/* --- STATE --- */
export interface MsgState {
    warning: string;
    success: string;
    error: string;
}
