import { CustomError } from 'utils/error';
import { Filters, GraphicData, GraphicDatas } from 'models';

/* --- STATE --- */
export interface GraphicDatasState {
    graphicDatas?: GraphicDatas;
    graphicData?: GraphicData | undefined;
    filters: Filters;

    error: CustomError | undefined;
    isLoading: boolean;
}

export default GraphicDatasState;
