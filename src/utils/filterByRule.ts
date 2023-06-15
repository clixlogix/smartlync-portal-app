import { Rule } from 'components/panels/RulesPanel/RulesPanel';

export const filterByRule = <T>(data: T[], rules: Rule[]): T[] => {
    if (!rules) {
        return data;
    }

    const rulesValues = rules?.reduce((acc, { keys, options }) => {
        acc[keys] = +options?.split(' ')[2];
        return acc;
    }, {});

    const filteredValues = data.filter((item) => {
        let match = true;

        for (let key in rulesValues) {
            if (item[key] && +item[key] > rulesValues[key]) {
                match = false;
                break;
            }
        }
        return match;
    });

    return filteredValues;
};
