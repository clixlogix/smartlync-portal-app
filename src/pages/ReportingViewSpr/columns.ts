import useMediaQuery from '@mui/material/useMediaQuery';

export function SimpleMediaQuery() {
    const matches = useMediaQuery('(min-width:600px)');

    return matches;
}

export const getInitialColumns = (screenSize: string): any[] => {
    let deviceNameWidth;
    switch (screenSize) {
        case 'small':
            deviceNameWidth = 130;
            break;
        default:
            deviceNameWidth = 280;
    }
    return [
        {
            name: 'tableColumnDeviceName',
            options: {
                filter: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content stud-type',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: deviceNameWidth,
                        minWidth: deviceNameWidth,
                        maxWidth: deviceNameWidth,
                        left: 0,
                        outline: '1.0px solid #525252',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header stud-type',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: 0,
                        width: deviceNameWidth,
                        minWidth: deviceNameWidth,
                        maxWidth: deviceNameWidth,
                        backgroundColor: '#182129',
                        color: '#FFF',
                        // zIndex: 101,
                        outline: '1.0px solid #525252',
                    },
                }),
            },
        },
    ];
};

export default getInitialColumns;
