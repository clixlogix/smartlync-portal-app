import PushPinIcon from '@mui/icons-material/PushPin';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Loader from 'components/Loader';
import { SidePanelOpenState } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    cycleGapMetaDataActions,
    cycleGapMetaDataKey,
    // cycleGapMetaDataActions,
    cycleGapMetaDataReducer,
} from 'services/cycle-gap-meta-data/cycle-gap-meta-data-reducer';
import {
    selectCycleGapMetaDataIsLoading,
    selectCycleGapMetaDataPins,
    selectCycleGapMetaDatas,
} from 'services/cycle-gap-meta-data/cycle-gap-meta-data-selectors';
import { getAllCycleGapMetaDatasSaga } from 'services/cycle-gap-meta-data/sagas/cycle-gap-meta-data-saga-get-all';
import { chartTheme, ThemeModes } from 'styles/theme/themes';
import { formatNumber } from 'utils';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import './ExtraPanel.scss';
import IoTFlowsLineChart from './IoTFlowsLineChart';

interface Props {
    extraPanelState: SidePanelOpenState;
}

export const ExtraPanel = (props: Props) => {
    const { extraPanelState } = props;

    useInjectReducer({ key: cycleGapMetaDataKey, reducer: cycleGapMetaDataReducer });
    useInjectSaga({ key: cycleGapMetaDataKey, saga: getAllCycleGapMetaDatasSaga });

    const [search, setSearch] = useState<string>('');
    let [metaDataObjectList, setMetaDataObjectList] = useState<object[]>([]);
    const { metaData, graphData }: any = useSelector(selectCycleGapMetaDatas);
    const loading: any = useSelector(selectCycleGapMetaDataIsLoading);
    const pinnedKeys = useSelector(selectCycleGapMetaDataPins);
    const metaDataObject: any = metaData ? metaData[0]?.META : undefined;
    const { palette } = useTheme();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(cycleGapMetaDataActions.getPins());
    }, []);
    useEffect(() => {
        if (!metaDataObject) return;

        const updatedList = Object?.entries(metaDataObject)
            ?.filter(([key]) => {
                return regex.test(key);
            })
            ?.map(([key, value]) => {
                return { key, value };
            });
        setMetaDataObjectList(updatedList);
    }, [search, metaDataObject]);

    const onSearchChanged = (text) => {
        setSearch(`${text}`.trim());
    };

    const handlePin = (key, method) => {
        if (method === 'push') {
            dispatch(cycleGapMetaDataActions.setPins([...pinnedKeys, key]));
        } else {
            let leftKeys = pinnedKeys.filter((kei) => kei !== key);
            dispatch(cycleGapMetaDataActions.setPins([...leftKeys]));
        }
    };

    const regex: RegExp = useMemo(() => {
        let re: RegExp;
        try {
            re = new RegExp(search, 'gi');
        } catch (e) {
            re = new RegExp('.*', 'gi');
        }
        return re;
    }, [search]);

    let pinns = [];
    pinnedKeys?.forEach((key) => {
        metaDataObjectList?.forEach((obj: any) => {
            if (obj.key === key) pinns.push(obj);
        });
    });
    pinnedKeys?.forEach((key) => {
        metaDataObjectList = metaDataObjectList?.filter((item: any) => item.key !== key);
    });

    const theme = useTheme();
    const themeMode = theme.palette.mode;
    const chartBgColor = themeMode === ThemeModes.dark ? chartTheme.backgroundDark : chartTheme.backgroundLight;
    return (
        <Paper
            sx={{
                height: '100%',
                transition: 'all 0.6s ease-in-out',
                width: '350px',
                ...(extraPanelState === 'open'
                    ? { maxWidth: '350px', marginLeft: '5px', padding: '10px' }
                    : { maxWidth: '0px', marginLeft: '0px' }),
            }}
        >
            {loading ? (
                <Loader circle />
            ) : typeof metaData !== 'undefined' && Object.keys(metaData[0].META).length > 0 ? (
                <>
                    <Box sx={{ marginBottom: '10px' }}>
                        <IoTFlowsLineChart
                            name="Current"
                            data={graphData}
                            themeMode={themeMode}
                            chartTextColor={theme.palette.text.primary}
                            chartBgColor={chartBgColor}
                        />
                    </Box>

                    <TextField
                        label="search"
                        variant="outlined"
                        value={search}
                        sx={{ width: '100%', mb: 1 }}
                        onChange={(e) => onSearchChanged(e.target.value)}
                    />

                    <TableContainer sx={{ maxHeight: window.innerHeight - 680 }}>
                        <TableBody
                            sx={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'space-around',
                                flexFlow: 'row wrap',
                                overflowY: 'auto',
                            }}
                        >
                            {pinns &&
                                pinns?.map(({ key, value }, index) => (
                                    <TableRow
                                        key={key + index}
                                        sx={{
                                            display: 'flex',
                                            borderBottom: '1px solid #333334',
                                            width: '100%',
                                            '&:last-child td, &:last-child th': { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            sx={{
                                                border: 0,
                                                maxWidth: '65% !important',
                                                overflow: 'hidden !important',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {key}
                                        </TableCell>
                                        <TableCell sx={{ marginLeft: 'auto', border: 0 }} align="right">
                                            {(isNaN(value as any) ? value : formatNumber(value as number)) as any}{' '}
                                        </TableCell>
                                        <TableCell sx={{ border: 0 }} align="right">
                                            <PushPinIcon
                                                sx={{
                                                    fontSize: '14px',
                                                    cursor: 'pointer',
                                                    color: palette.primary.main,
                                                }}
                                                onClick={() => {
                                                    handlePin(key, null);
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {metaDataObject &&
                                metaDataObjectList?.map(({ key, value }, index) => (
                                    <TableRow
                                        key={key + index}
                                        sx={{
                                            display: 'flex',
                                            borderBottom: '1px solid #333334',
                                            width: '100% !important',
                                            '&:last-child td, &:last-child th': { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            sx={{
                                                border: 0,
                                                maxWidth: '65% !important',
                                                overflow: 'hidden !important',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {key}
                                        </TableCell>
                                        <TableCell sx={{ marginLeft: 'auto', border: 0 }} align="right">
                                            {(isNaN(value as any) ? value : formatNumber(value as number)) as any}{' '}
                                        </TableCell>
                                        <TableCell sx={{ border: 0 }} align="right">
                                            <PushPinIcon
                                                sx={{ fontSize: '14px', cursor: 'pointer' }}
                                                onClick={() => {
                                                    handlePin(key, 'push');
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </TableContainer>
                </>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Typography variant="subtitle1" component="div">
                        No Data for this station
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};
