/**
 *
 * TopXTable
 *
 */
import Card from '@mui/material/Card';
import { TableTheme } from 'components/Table/Table';
import MUIDataTable from 'mui-datatables';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SizeMe } from 'react-sizeme';
import { messages } from './messages';

import { Box, styled, useTheme } from '@mui/material';
import Loader from 'components/Loader';
import TreeChart from 'components/treeChart/tree.chart';
import { _ } from 'utils';
import { ThemeModes, chartTheme } from 'styles/theme/themes';

interface TopXTableProps {
    title?: string;
    topX?: number;
    numberOfTable?: number;
    tableData?: any[];
    showIndex?: boolean;
    options?: any;
    columns: any[];
    theme?: TableTheme;
    backgroundColor?: string;
    themeObj?: any;
    elevation?: number;
    isLoading?: boolean;
    treeView?: boolean;
}

export const TopXTablePanel: React.FC<TopXTableProps> = memo((props: TopXTableProps) => {
    const {
        topX = 10,
        numberOfTable = 2,
        tableData = [],
        showIndex = true,
        options = {},
        columns = [],
        title = `Top ${props.topX || 10} `,
        elevation = 0,
        isLoading = false,
        treeView = false,
    } = props;

    const { t } = useTranslation();
    // const {
    //     palette,
    //     palette: { mode },
    // }: 'light' | 'dark' = useTheme();

    const columnLookup = useMemo(() => {
        const cols = columns.reduce(
            (acc = {} as any, col, index) => {
                let column = col || {};

                if (typeof col === 'string') {
                    column = { name: col };
                }

                const columnOrder = column.columnOrder >= 0 ? column.columnOrder : index;
                acc[column.name] = { ...column, columnOrder };

                return acc;
            },
            {
                index: {
                    name: 'index',
                    label: ' ',
                    display: showIndex,
                    options: {
                        customBodyRender: (value) => {
                            return value + 1 + '.';
                        },
                        setCellProps: (value) => ({}),
                        setCellHeaderProps: (value) => ({}),
                    },
                    columnOrder: -1,
                },
            } as any,
        );

        return cols;
    }, [columns, showIndex]);

    const [displayRows, tableColumns] = useMemo(() => {
        let data: any[] = [...tableData];

        if (tableData?.length <= 0) {
            return [[], []];
        }

        const tableColumns: any[] = [];

        if (data.length < topX) {
            const cols = Object.keys(data[0]).reduce((acc = {}, key) => ({ ...acc, [key]: undefined }), {} as any);

            for (let index = data.length; index < topX; index++) {
                data.push({ ...cols, index } as any);
            }
        }

        const chunks = Math.ceil(data.length / numberOfTable);

        const dataChunk = _.chunk(data.slice(0, topX), chunks);
        const dRows = dataChunk.reduce((acc, dChunk, i) => {
            const posStart = i * Object.keys(columnLookup).length;
            acc = acc.map((row, index) => {
                if (index > dChunk.length - 1) return { ...row };
                const rowValues = Object?.entries(dChunk[index]).reduce((ac, [key, value]) => {
                    const name: string = `${key}.${i}`;
                    ac[name] = value;
                    if (index === 0 && columnLookup[key]) {
                        const columnOrder = columnLookup[key].columnOrder + posStart + 1;
                        const newCol: any = { ...columnLookup[key], name, columnOrder };
                        tableColumns.push(newCol);
                    }
                    return ac;
                }, {} as any);

                return {
                    ...row,
                    ...rowValues,
                };
            });

            if (i < dataChunk.length - 1) {
                tableColumns.push({
                    name: 'index',
                    label: <span> &nbsp; </span>,
                    options: {
                        setCellProps: (value) => ({}),
                        setCellHeaderProps: (value) => ({}),
                    },
                });
            }

            return acc;
        }, new Array(dataChunk[0].length).fill({}));

        return [dRows, tableColumns];
    }, [tableData, topX, numberOfTable, columnLookup]);

    const sortedColumns = useMemo(() => {
        return tableColumns
            .sort((a: any, b: any) => a.columnOrder - b.columnOrder)
            .reduce((acc = [], col, index) => {
                const { name = '' } = col;

                if (!(!showIndex && name.includes('index.'))) {
                    acc.push(col);
                }

                return acc;
            }, []);
    }, [tableColumns, showIndex]);

    const tableOptions = {
        sort: false,
        filter: false,
        fixedHeader: true,
        filterType: false,
        download: false,
        search: false,
        print: false,
        viewColumns: false,
        selectableRows: 'none',
        pagination: false,
        selectableRowsHeader: false,
        responsive: 'vertical',
        customToolbar: null,
        elevation,

        onRowClick(rowNode) {},
        textLabels: {
            body: {
                noMatch: t(messages.noData),
            },
        },
        ...options,
    };
    const themeMode: 'light' | 'dark' = useTheme().palette.mode;
    const backgroundColor = themeMode === ThemeModes.dark ? chartTheme.backgroundDark : chartTheme.backgroundLight;
    const MUIDataTableStyled = styled(MUIDataTable)`
        && {
            padding: 0 10px;
            padding-top: 10px;
            width: 100%;
            background-color: ${backgroundColor};
            ,
            th {
                font-size: 0.67rem;
                padding: 14px 5px;
                font-weight: 700;
                background-color: ${backgroundColor};
            }
            ,
            td {
                font-size: 12px;
                padding: 13.5px 5px;
                border-bottom: none;
            }
        }
    `;
    return (
        <Card sx={{ width: '100%', display: 'flex', flex: 1 }}>
            <SizeMe monitorHeight>
                {({ size }) => {
                    const { height = 0 } = size as any;
                    const tableBodyHeight = height - 70;

                    return treeView ? (
                        <>
                            {isLoading ? (
                                <Loader circle />
                            ) : (
                                <Box sx={{ width: '100%' }}>
                                    <MUIDataTableStyled
                                        title={title.split('Top 10')[1]}
                                        options={{
                                            ...tableOptions,
                                            tableBodyHeight: `${0}px`,
                                        }}
                                    />
                                    <TreeChart height={`${tableBodyHeight}px`} data={tableData} title={title} />
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            {isLoading ? (
                                <Loader circle />
                            ) : (
                                <MUIDataTableStyled
                                    title={title}
                                    data={displayRows}
                                    columns={sortedColumns}
                                    options={{
                                        ...tableOptions,
                                        tableBodyHeight: `${tableBodyHeight}px`,
                                    }}
                                />
                            )}
                        </>
                    );
                }}
            </SizeMe>
        </Card>
    );
});

export default TopXTablePanel;
