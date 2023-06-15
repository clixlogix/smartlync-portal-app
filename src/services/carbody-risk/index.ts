import { CustomError } from 'utils/error';
import { Filters, CarbodyRisk, CarbodyRisks, RiskTableHeadValue } from 'models';

/* --- STATE --- */
export interface CarbodyRisksState {
    carbodyRisks?: CarbodyRisks;
    carbodyRisk?: CarbodyRisk | undefined;
    columns?: RiskTableHeadValue[];
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default CarbodyRisksState;
