import { useEffect, useState } from 'react';
import { FilterNames, Filters } from 'models';
import Constant from 'constants/index';

interface UseFilterParams {
    defaultFilters: Filters;
    listOfLocalFilters?: FilterNames[];
}

export const useFilters = ({ defaultFilters, listOfLocalFilters }: UseFilterParams) => {
    const filtersList = listOfLocalFilters ? listOfLocalFilters : Constant.localFilters;

    const onFirstRender = (newFilter: Filters) => {
        let local = {};
        let api = {};

        for (let key in newFilter) {
            if (filtersList.includes(key)) {
                local = { ...local, [key]: newFilter[key] };
            } else {
                api = { ...api, [key]: newFilter[key] };
            }
        }
        return {
            local,
            api,
        };
    };

    const [localFilters, setLocalFilters] = useState<Filters>(onFirstRender(defaultFilters).local);
    const [apiFilters, setApiFilters] = useState<Filters>(onFirstRender(defaultFilters).api);

    const changeFilters = (newFilter: Filters) => {
        let local = { ...localFilters };
        let api = { ...apiFilters };

        for (let key in newFilter) {
            if (filtersList.includes(key)) {
                local = { ...local, [key]: newFilter[key] };
                setLocalFilters(local);
            } else {
                api = { ...api, [key]: newFilter[key] };
                setApiFilters(api);
            }
        }
    };

    useEffect(() => {
        changeFilters(defaultFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        apiFilters,
        localFilters,
        changeFilters,
    };
};
