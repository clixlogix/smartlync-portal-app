/**
 *
 * UploadStat
 *
 */
import React, { useMemo, useState, memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import Button, { Color } from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { uploadStatActions, uploadStatReducer, uploadStatKey } from 'services/upload-stat/upload-stat-reducer';
import { selectUploadListItems, selectUploadListItemIsLoading } from 'services/upload-stat/upload-stat-selectors';
import { getAllUploadListItemsSaga } from 'services/upload-stat/sagas/upload-stat-saga-get-all';
import { Filters, UploadListItems, FilterNames, ReportingDataView, ReportingIntervalViews } from 'models';
import Table from 'components/Table';
import { formatFileSize, useQueryParam } from 'utils';
import { DashboardFilter } from 'components/panels/SideFilterPanel/SideFilterPanel';
import { WidgetProps, Widget } from 'widgets';
import moment, { Moment } from 'moment';
import { messages } from './messages';

import 'scss/main.scss';
import './UploadStat.scss';

interface UploadStatProps extends WidgetProps {
    view?: ReportingDataView;

    onViewChange?(view: ReportingDataView);
}

export const UploadStatWidget: Widget<UploadStatProps> = memo((props: UploadStatProps) => {
    useInjectReducer({ key: uploadStatKey, reducer: uploadStatReducer });
    useInjectSaga({ key: uploadStatKey, saga: getAllUploadListItemsSaga });

    const { className = '', filters = {} } = props;
    const { t, i18n } = useTranslation();
    const [plantId] = useQueryParam<string>('plantId', '1', true);

    const uploadListItems: UploadListItems | undefined = useSelector(selectUploadListItems);
    const isLoading: boolean = useSelector(selectUploadListItemIsLoading);
    const dispatch = useDispatch();

    if (props.isLoading) {
        props.isLoading(isLoading);
    }

    const [widgetFilter, setWidgetFilters] = useState<Filters>({
        [FilterNames.plantId]: plantId,
        [FilterNames.selectedLanguage]: i18n.language,
        [FilterNames.view]: ReportingDataView.Hourly,
        ...defaultFilters,
        // add your filters here
        ...filters,
    });

    const widgetFilters = useMemo(
        () => ({
            ...filters,
            ...widgetFilter,
        }),
        [widgetFilter, filters],
    );

    useEffect(() => {
        dispatch(uploadStatActions.getAllUploadListItems(widgetFilters));
    }, [dispatch, widgetFilters]);

    const displayRows = useMemo(() => {
        const items = uploadListItems?.reduce((acc: Map<string, any>, { dateTime, size, count, name }) => {
            const date = moment(dateTime);

            const key = date.format(ReportingIntervalViews[widgetFilters.view].groupBy);

            if (!acc.has(key)) {
                acc.set(key, {
                    dateTime: date.startOf(ReportingIntervalViews[widgetFilters.view].duration).format(),
                    size: 0,
                    count: 0,
                    names: [],
                });
            }

            const value = acc.get(key);

            value.size += size;
            value.count += count;
            value.names.push(name);

            acc.set(key, value);

            return acc;
        }, new Map<string, any>());

        // return uploadListItems;
        return Array.from(items.values());
    }, [uploadListItems, widgetFilters.view]);

    const tableTheme = useMemo(() => {
        const obj: any = {
            root: {
                '&$disabled': {
                    color: '#ffdb38',
                },
            },
            MuiTableCell: {
                root: {
                    font: 'normal normal normal 18px/60px Open Sans',
                },
                footer: { color: 'rgba(255,255,255,1)' },
                head: { outline: '1px solid silver' },
            },
            MUIDataTableBodyCell: {
                stackedCommon: {
                    color: '#fff',
                    textAlign: 'center',
                },
            },
            MUIDataTableFooter: {
                root: {
                    color: 'white',
                },
            },
            MUIDataTableJumpToPage: { root: { color: 'rgba(255,255,255,1)' }, input: { color: 'rgba(255,255,255,1)' } },
            MuiSelect: { icon: { color: 'rgba(255,255,255,1)' } },
            MuiTypography: { root: { color: 'rgba(255,255,255,1)' }, colorInherit: { color: 'rgba(255,255,255,1)' } },
            MuiButtonBase: { root: { color: 'rgba(255,255,255,1)' } },
            MuiInputBase: { input: { color: 'rgba(255,255,255,1)' } },
        };

        return obj;
    }, []);

    const columns = [
        {
            name: 'dateTime',
            label: (
                <span>
                    {t(messages.uploadTimeLabel)}
                    <Br />({widgetFilters.view})
                </span>
            ),
            options: {
                customBodyRender: (value: Moment, tableMeta, updateValue) => (
                    <Div>{moment(value).format(ReportingIntervalViews[widgetFilters.view].formatGeneral)}</Div>
                ),
            },
        },
        {
            name: 'size',
            label: t(messages.fileSizeLabel),
            options: {
                setCellProps: () => ({ className: 'text-ellipsis-3-line ' }),
                customBodyRender: (value: number, tableMeta, updateValue) => <Div>{formatFileSize(value)}</Div>,
            },
        },
        {
            name: 'count',
            label: t(messages.numberOfFilesLabel),
            options: {
                setCellProps: () => ({ className: 'text-ellipsis-3-line ' }),
                customBodyRender: (value: number, tableMeta, updateValue) => (
                    <Div>{new Intl.NumberFormat(i18n.language, { maximumSignificantDigits: 5 }).format(value)} </Div>
                ),
            },
        },
        {
            name: 'names',
            label: t(messages.fileNamesLabel),
            options: {
                setCellProps: () => ({ className: 'text-ellipsis-3-line ' }),
                customBodyRender: (value: string[] = [], tableMeta, updateValue) => (
                    <Div>
                        {value.map((n) => (
                            <Span>
                                {n}
                                <Br />
                            </Span>
                        ))}
                    </Div>
                ),
            },
        },
    ];

    const onViewChange = (view) => {
        setWidgetFilters({ ...widgetFilters, view });
    };

    const customToolbar = () => {
        const renderBtn = (id: string = ReportingDataView.Daily, label: string = '', active = false) => (
            <Button
                className={`x-cls-toolbar-btn ${id.toLowerCase}`}
                id={id}
                name={id}
                aria-label={id}
                variant={'contained'}
                color={active ? 'primary' : ('seconday' as Color)}
                onClick={() => onViewChange(id)}
            >
                <Span>{id}</Span>
            </Button>
        );

        return (
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                {renderBtn(ReportingDataView.Hourly, '', widgetFilters.view === ReportingDataView.Hourly)}
                {renderBtn(ReportingDataView.Daily, '', widgetFilters.view === ReportingDataView.Daily)}
                {renderBtn(ReportingDataView.Weekly, '', widgetFilters.view === ReportingDataView.Weekly)}
                {renderBtn(ReportingDataView.Monthly, '', widgetFilters.view === ReportingDataView.Monthly)}
            </ButtonGroup>
        );
    };

    const options = {
        customToolbar,
        filterType: 'checkbox',
        elavation: 4,
        enableNestedDataAccess: '.',
        // responsive: 'scrollMaxHeight',
        // responsive: 'sstackedcroll',
        // onRowClick: handleOnRowClick,
    };

    return (
        <Div className={`${className} x-cls-upload-stat-widget`}>
            <Table
                className={`x-cls-upload-stat-widget-table`}
                data={displayRows}
                columns={columns}
                options={{ ...options }}
                themeObj={tableTheme}
            />
        </Div>
    );
});

const Div = styled.div``;
const Br = styled.br``;
const Span = styled.span``;

// extra widget properties
const defaultFilters: DashboardFilter[] = [];

export const UploadStatProperty = Object.assign(
    {},
    {
        defaultFilters,
        type: 'panel',
        layout: {
            w: 4,
            h: 2,
            minW: 2,
            minH: 1,
        },
    },
);

export default UploadStatWidget;
