import PushPinIcon from '@mui/icons-material/PushPin';
import { Paper, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { OperationItems, SidePanelOpenState } from 'models';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { historicalDiagnosticGraphActions } from 'services/historical-diagnostic-graph/historical-diagnostic-graph-reducer';
import {
    selectHistoricalDiagnosticGraphs,
    selectHistoricalGraphsPins,
} from 'services/historical-diagnostic-graph/historical-diagnostic-graph-selectors';
import { selectOperationItems } from 'services/process-operation/process-operation-selectors';
import { _ } from 'utils';
import './ExtraData.scss';

interface ExtraDataProps {
    extraPanelState?: SidePanelOpenState;
    activityState?: string;
}

export const ExtraData = ({ extraPanelState = SidePanelOpenState.Close, activityState }: ExtraDataProps) => {
    const processLogs: OperationItems | undefined = useSelector(selectOperationItems);
    const HistoricalGraphLog: any = useSelector(selectHistoricalDiagnosticGraphs);
    const pinnedKeys = useSelector(selectHistoricalGraphsPins);
    const [metaDataObjects, setMetaDataObjecs] = useState<object>({});
    const [search, setSearch] = useState<string>('');
    const { palette } = useTheme();
    const { otherData = {} } = processLogs?.length > 0 ? processLogs[0] : {};
    const dispatch = useDispatch();
    let meta = activityState === 'active' ? otherData : HistoricalGraphLog.length && HistoricalGraphLog[0].meta;
    meta = meta || {};

    const onSearchChanged = (text) => {
        setSearch(`${text}`.trim());
    };

    useEffect(() => {
        if (!meta) return;
        setMetaDataObjecs(meta);
    }, [meta]);

    const regex: RegExp = useMemo(() => {
        let re: RegExp;
        try {
            re = new RegExp(search, 'gi');
        } catch (e) {
            re = new RegExp('.*', 'gi');
        }
        return re;
    }, [search]);

    const handlePin = (key, method) => {
        if (method === 'push') {
            dispatch(historicalDiagnosticGraphActions.setPins([...pinnedKeys, key]));
        } else {
            let leftKeys = pinnedKeys.filter((kei) => kei !== key);
            dispatch(historicalDiagnosticGraphActions.setPins([...leftKeys]));
        }
    };

    let pins = {};

    pinnedKeys?.forEach((key) => {
        Object.entries(meta).map((elem) => {
            let elemKey = elem[0];
            let value = elem[1];
            let obj = { [elemKey]: value };
            if (elemKey === key) pins = { ...pins, ...obj };
        });
    });

    useEffect(() => {
        pinnedKeys?.forEach((key) => {
            Object.keys(meta).map((itm) => {
                let temp;
                if (itm[0] !== key) {
                    temp = _.omit(metaDataObjects, [`${key}`]);
                    setMetaDataObjecs({ ...temp });
                }
            });
        });
    }, [pinnedKeys,meta]);

    return (
        <Paper sx={{ padding: '10px', margin: '15px 0px' }}>
            <TextField
                label="search"
                variant="outlined"
                value={search}
                sx={{ width: '100%' }}
                onChange={(e) => onSearchChanged(e.target.value)}
            />

            <TableContainer>
                <TableBody
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        flexFlow: 'row wrap',
                        overflowY: 'auto',
                        height: '50vh',
                    }}
                >
                    {Object?.entries(pins)
                        ?.filter(([key]) => regex.test(key))
                        ?.map(([key, value]) => (
                            <TableRow
                                key={key}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #333334',
                                    width: '100%',
                                    '&:last-child td, &:last-child th': { border: 0 },
                                }}
                                // onClick={() => setActiveState('false')}
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
                                <TableCell
                                    sx={{
                                        marginLeft: 'auto',
                                        border: 0,
                                        maxWidth: '65% !important',
                                        overflow: 'hidden !important',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {value as any}
                                </TableCell>
                                <TableCell sx={{ border: 0 }} align="right">
                                    <PushPinIcon
                                        sx={{
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            color: palette.primary.main,
                                        }}
                                        onClick={() => {
                                            handlePin(key, 'pop');
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    {Object?.entries(metaDataObjects)
                        ?.filter(([key]) => regex.test(key))
                        ?.map(([key, value]) => (
                            <TableRow
                                key={key}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #333334',
                                    width: '100%',
                                    '&:last-child td, &:last-child th': { border: 0 },
                                }}
                                // onClick={() => setActiveState('false')}
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
                                <TableCell
                                    sx={{
                                        marginLeft: 'auto',
                                        border: 0,
                                        maxWidth: '65% !important',
                                        overflow: 'hidden !important',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {value as any}
                                </TableCell>
                                <TableCell sx={{ border: 0 }} align="right">
                                    <PushPinIcon
                                        sx={{
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            handlePin(key, 'push');
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </TableContainer>
        </Paper>
    );
};
