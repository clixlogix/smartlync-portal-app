export const columns = {
    filter: true,
    setCellProps: () => ({
        className: 'cell-content maintenance-header',
        style: {
            position: 'sticky',
            // backgroundColor: '#000',
            color: '#FFF',
            // width: 100,
            // minWidth: 100,
            // maxWidth: 100,
            // left: 80,
            border: '1.0px solid #525252',
        },
    }),
    setCellHeaderProps: () => ({
        className: 'cell-header maintenance-header',
        style: {
            whiteSpace: 'nowrap',
            position: 'sticky',
            // left: 80,
            backgroundColor: '#ffdb0a',
            color: '#000',
            // zIndex: 101,
            border: '1.0px solid #525252',
        },
    }),
};

export default columns;
