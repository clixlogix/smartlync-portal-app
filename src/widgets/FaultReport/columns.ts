import { FilterNames } from 'models';

export const columns: any[] = [
    {
        label: 'tableColumnStudType',
        name: FilterNames.studType,
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content stud-type',
                style: {
                    position: 'sticky',
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    width: 122,
                    minWidth: 122,
                    maxWidth: 122,
                    left: 0,
                    border: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header stud-type',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 0,
                    width: 122,
                    minWidth: 122,
                    maxWidth: 122,
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                },
            }),
        },
    },
    {
        label: 'tableColumnDeviceName',
        name: FilterNames.deviceName,
        options: {
            filter: true,
            setCellProps: () => ({
                className: 'cell-content device-name',
                style: {
                    position: 'sticky',
                    left: 122,
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    width: 280,
                    minWidth: 280,
                    maxWidth: 280,
                    border: '1.0px solid #525252',
                },
            }),
            setCellHeaderProps: () => ({
                className: 'cell-header device-name',
                style: {
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    left: 122,
                    backgroundColor: '#182129',
                    color: '#FFF',
                    zIndex: 101,
                    border: '1.0px solid #525252',
                    width: 280,
                    minWidth: 280,
                    maxWidth: 280,
                },
            }),
        },
    },
    // {
    //     label: 'tableColumnStudId',
    //     name: FilterNames.studId,
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
    //                 border: '1.0px solid #525252',
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
    //                 border: '1.0px solid #525252',
    //                 // width: '250px',
    //                 // minWidth: '250px',
    //                 // maxWidth: '250px',
    //             },
    //         }),
    //     },
    // },
];

export default columns;
