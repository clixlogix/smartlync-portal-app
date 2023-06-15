import useMediaQuery from '@mui/material/useMediaQuery';

export function SimpleMediaQuery() {
    const matches = useMediaQuery('(min-width:600px)');

    return matches;
}

export const getInitialColumns = (screenSize: string): any[] => {
    // let deviceNameWidth;
    let studTypeWidth;
    let deviceNameWidth;
    switch (screenSize) {
        case 'small':
            studTypeWidth = 100;
            deviceNameWidth = 130;
            break;
        default:
            // studTypeWidth = 122;
            studTypeWidth = 122;
            deviceNameWidth = 280;
    }
    return [
        {
            name: 'tableColumnStudType',
            options: {
                filter: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content stud-type',
                    style: {
                        position: 'sticky',
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: studTypeWidth,
                        minWidth: studTypeWidth,
                        maxWidth: studTypeWidth,
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
                        width: studTypeWidth,
                        minWidth: studTypeWidth,
                        maxWidth: studTypeWidth,
                        backgroundColor: '#182129',
                        color: '#FFF',
                        // zIndex: 101,
                        outline: '1.0px solid #525252',
                    },
                }),
            },
        },
        {
            name: 'tableColumnDeviceName',
            options: {
                filter: true,
                sortThirdClickReset: true,
                setCellProps: () => ({
                    className: 'cell-content device-name',
                    style: {
                        position: 'sticky',
                        left: studTypeWidth,
                        backgroundColor: '#182129',
                        color: '#FFF',
                        width: deviceNameWidth,
                        minWidth: deviceNameWidth,
                        maxWidth: deviceNameWidth,
                        outline: '1.0px solid #525252',
                    },
                }),
                setCellHeaderProps: () => ({
                    className: 'cell-header device-name',
                    style: {
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        left: studTypeWidth,
                        backgroundColor: '#182129',
                        color: '#FFF',
                        // zIndex: 101,
                        outline: '1.0px solid #525252',
                        width: deviceNameWidth,
                        minWidth: deviceNameWidth,
                        maxWidth: deviceNameWidth,
                    },
                }),
            },
        },
        // {
        //     name: 'tableColumnStudId',
        //     options: {
        //         filter: true,
        //         display: false,
        //         setCellProps: () => ({
        //             className: 'cell-content stud-id',
        //             style: {
        //                 position: 'sticky',
        //                 backgroundColor: '#182129',
        //                 color: '#FFF',
        //                 width: '250px',
        //                 minWidth: '250px',
        //                 maxWidth: '250px',
        //                 left: 340,
        //                 outline: '1.0px solid #525252',
        //             },
        //         }),
        //         setCellHeaderProps: () => ({
        //             className: 'cell-header stud-id',
        //             style: {
        //                 whiteSpace: 'nowrap',
        //                 position: 'sticky',
        //                 left: 340,
        //                 background: 'white',
        //                 zIndex: 101,
        //                 backgroundColor: '#182129',
        //                 outline: '1.0px solid #525252',
        //                 // width: '250px',
        //                 // minWidth: '250px',
        //                 // maxWidth: '250px',
        //             },
        //         }),
        //     },
        // },
    ];
};

export default getInitialColumns;
