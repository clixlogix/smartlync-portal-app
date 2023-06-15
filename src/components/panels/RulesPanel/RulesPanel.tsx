import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { Button, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from './TabPanel';
import { SelectRule } from './SelectRule';
import { rulesPanelActions, rulesPanelKey, rulesPanelReducer } from 'services/rules-panel/rules-panel-reducer';
import { useInjectReducer } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAppliedRules,
    selectIsPanelOpen,
    selectRules,
    selectSavedRules,
} from 'services/rules-panel/rules-panel-selectors';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import moment from 'moment';

const useStyles = makeStyles({});

interface RulesPanelProps {
    toggleDrawer: (value: boolean) => void;
    keys: string[];
    data: any[] | undefined;
    onApply: (rules: Rule[]) => void;
}

export type Rule = {
    id?: number;
    where: string;
    keys: string;
    is: string;
    options: string;
};

const initialRule: Rule = {
    where: '',
    keys: '',
    is: '',
    options: '',
};

export const RulesPanel = ({ toggleDrawer, keys, data = [], onApply }: RulesPanelProps) => {
    useInjectReducer({ key: rulesPanelKey, reducer: rulesPanelReducer });

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();

    const [tabValue, setTabValue] = useState<number>(0);
    const [rule, setRule] = useState<Rule>(initialRule);

    const isPanelOpen = useSelector(selectIsPanelOpen);
    const rulesFromStore = useSelector(selectRules);
    const savedRulesFromStore = useSelector(selectSavedRules);
    const appliedRules = useSelector(selectAppliedRules);

    useEffect(() => {
        dispatch(rulesPanelActions.getRules());
    }, [dispatch]);

    useEffect(() => {
        onApply(appliedRules);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedRules]);

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
    };

    const createOptions = (option: string, data: any[]): string[] => {
        const numbers: number[] = data
            .map((item) => {
                if (Number.isNaN(+item[option])) {
                    return 0;
                }
                return +item[option];
            })
            .sort((a, b) => a - b);

        const find90: number = Math.floor(numbers.length * 0.9);
        const find75: number = Math.floor(numbers.length * 0.75);
        const find50: number = Math.floor(numbers.length * 0.5);
        const find25: number = Math.floor(numbers.length * 0.25);

        return [
            `less than ${numbers[find90] < 100 ? numbers[find90]?.toFixed(2) : Math.round(numbers[find90] / 10) * 10}`,
            `less than ${numbers[find75] < 100 ? numbers[find75]?.toFixed(2) : Math.round(numbers[find75] / 10) * 10}`,
            `less than ${numbers[find50] < 100 ? numbers[find50]?.toFixed(2) : Math.round(numbers[find50] / 10) * 10}`,
            `less than ${numbers[find25] < 100 ? numbers[find25]?.toFixed(2) : Math.round(numbers[find25] / 10) * 10}`,
        ];
    };

    const selectsOptions = {
        where: ['Where'],
        keys: keys,
        is: ['is'],
        options: rule['keys'] ? createOptions(rule['keys'], data) : [],
    };

    const handleRuleChange = (value: Rule): void => {
        const newRule: any = {
            ...rule,
            ...value,
        };
        setRule(newRule);
    };

    const isSavedOrApplied = (id: number, rules: Rule[]): boolean => !!rules.filter((item) => item.id === id).length;

    return (
        <>
            <Drawer
                anchor="right"
                variant="persistent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                open={isPanelOpen}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <Typography variant="h6" style={{ fontSize: '20px', color: '#fff' }}>
                        {t(messages.title)}
                    </Typography>
                    <Box>
                        <Button className={classes.root}>
                            <FileDownloadDoneIcon
                                onClick={() => dispatch(rulesPanelActions.saveRule(rulesFromStore))}
                            />
                        </Button>
                        <Button onClick={() => toggleDrawer(false)} className={classes.root}>
                            <CloseIcon />
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Tabs value={tabValue} variant="fullWidth" className={classes.tabs} onChange={handleTabChange}>
                        <Tab label={t(messages.newRule)} />
                        <Tab label={t(messages.savedRules)} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '28px',
                            }}
                        >
                            {Object.keys(rule).map((condition) => {
                                const options = {
                                    name: condition,
                                    className: condition,
                                    inputVariant: 'standard',
                                    options: selectsOptions[condition],
                                    onChange: handleRuleChange,
                                    value: rule[condition] ? rule[condition] : null,
                                };
                                return <SelectRule key={condition} {...options} />;
                            })}
                            <Tooltip title="add rule">
                                <Button className={classes.root}>
                                    <AddIcon
                                        onClick={() => {
                                            if (Object.values(rule).some((item) => item === '')) return;
                                            dispatch(rulesPanelActions.addRule({ id: moment().valueOf(), ...rule }));
                                            setRule(initialRule);
                                        }}
                                    />
                                </Button>
                            </Tooltip>
                        </Box>
                        {rulesFromStore.map(({ id, ...rest }) => (
                            <Box
                                key={id}
                                sx={{
                                    mt: 3,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography className={classes.typography}>{Object.values(rest).join(' ')}</Typography>
                                <Box>
                                    {isSavedOrApplied(id as number, appliedRules) ? (
                                        <Typography variant="button" style={{ marginLeft: '10px' }}>
                                            <Button
                                                variant="text"
                                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                onClick={() => {
                                                    dispatch(rulesPanelActions.canselAppliedRule(id as number));
                                                }}
                                            >
                                                cancel
                                            </Button>
                                        </Typography>
                                    ) : (
                                        <Tooltip title="apply rule">
                                            <Button variant="text" className={classes.root}>
                                                <CheckIcon
                                                    onClick={() => {
                                                        dispatch(rulesPanelActions.applyRule({ id, ...rest }));
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                    )}

                                    {isSavedOrApplied(id as number, savedRulesFromStore) ? (
                                        <Typography
                                            variant="button"
                                            style={{ marginLeft: '10px', color: 'rgba(255, 255, 255, 0.7)' }}
                                        >
                                            {t(messages.saved)}
                                        </Typography>
                                    ) : (
                                        <Tooltip title="save rule">
                                            <Button className={classes.root}>
                                                <SaveIcon
                                                    onClick={() =>
                                                        dispatch(rulesPanelActions.saveRule({ id, ...rest }))
                                                    }
                                                />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="delete rule">
                                        <Button className={classes.root}>
                                            <DeleteIcon
                                                onClick={() => dispatch(rulesPanelActions.deleteRule(id as number))}
                                            />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>
                        ))}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        {savedRulesFromStore.map(({ id, ...rest }) => (
                            <Box
                                key={id}
                                sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Typography className={classes.typography}>{Object.values(rest).join(' ')}</Typography>
                                <Box>
                                    {isSavedOrApplied(id as number, appliedRules) ? (
                                        <Typography variant="button" style={{ marginLeft: '10px' }}>
                                            <Button
                                                variant="text"
                                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                onClick={() => {
                                                    dispatch(rulesPanelActions.canselAppliedRule(id as number));
                                                }}
                                            >
                                                cancel
                                            </Button>
                                        </Typography>
                                    ) : (
                                        <Tooltip title="apply rule">
                                            <Button variant="text" className={classes.root}>
                                                <CheckIcon
                                                    onClick={() => {
                                                        dispatch(rulesPanelActions.applyRule({ id, ...rest }));
                                                    }}
                                                />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="remove from saved">
                                        <Button className={classes.root}>
                                            <DeleteIcon
                                                onClick={() =>
                                                    dispatch(rulesPanelActions.removeFromSaved(id as number))
                                                }
                                            />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Box>
                        ))}
                    </TabPanel>
                </Box>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }} variant="fullWidth" />
                <Box sx={{ p: 2, marginLeft: 'auto' }}>
                    <Button
                        onClick={() => dispatch(rulesPanelActions.saveRule(rulesFromStore))}
                        variant="text"
                        className={classes.saveAllButton}
                    >
                        save all
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.applyAllButton}
                        onClick={() => {
                            dispatch(
                                rulesPanelActions.applyRule(tabValue === 0 ? rulesFromStore : savedRulesFromStore),
                            );
                        }}
                    >
                        apply all
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};
