import { CustomError } from 'utils/error';
import { Filters, Settings, Settingss } from 'models';

/* --- STATE --- */
export interface SettingssState {
    settingss?: Settingss;
    settings?: Settings | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default SettingssState;
