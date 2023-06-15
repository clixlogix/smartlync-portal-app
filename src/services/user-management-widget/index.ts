import { CustomError } from 'utils/error';
import { Filters, UserManagementWidget, UserManagementWidgets } from 'models';

/* --- STATE --- */
export interface UserManagementWidgetsState {
    userManagementWidgets?: UserManagementWidgets;
    userManagementWidget?: UserManagementWidget | undefined;
    userManagementWidgetsFilteredByRules: UserManagementWidgets;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default UserManagementWidgetsState;
