import React, { useMemo, memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import {
    recommendedActionsActions,
    recommendedActionsReducer,
    recommendedActionsKey,
} from 'services/recommended-action/recommended-actions/recommended-action-reducer';
import {
    recommendedActionSubmitsActions,
    recommendedActionSubmitsReducer,
    recommendedActionSubmitsKey,
} from 'services/recommended-action/recommended-action-submit/recommended-action-submit-reducer';
import {
    recommendedActionsHistorysActions,
    recommendedActionsHistorysReducer,
    recommendedActionsHistorysKey,
} from 'services/recommended-action/recommended-actions-history/recommended-actions-history-reducer';
import {
    selectRecommendedActions,
    selectGetRecommendedAction,
    selectRecommendedActionsIsLoading,
} from 'services/recommended-action/recommended-actions/recommended-action-selectors';
import { selectLoggedInUserDetails } from 'services/auth/auth-selectors';
import { selectRecommendedActionsHistorys } from 'services/recommended-action/recommended-actions-history/recommended-actions-history-selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
    Filters,
    FaultActions,
    FaultActionView,
    RecommendedAction,
    RecommendedData,
    FaultAction,
    FaultActionType,
} from 'models';
import { recommendedActionsSaga } from 'services/recommended-action/recommended-actions/recommended-action-saga';
import { useLocalStorage } from 'utils';
import { recommendedActionSubmitsSaga } from 'services/recommended-action/recommended-action-submit/recommended-action-submit-saga';
import { getAllRecommendedActionsHistorysSaga } from 'services/recommended-action/recommended-actions-history/recommended-actions-history-saga-get-all';
import { SelectField } from 'components/formFields/SelectField';
import Constants from 'constants/index';

import { messages } from './messages';

import './SliderPanel.scss';

interface SliderPanelProps {
    open: boolean;
    className?: string;
    closePopup(): void;
    selectedFilters: Filters;
}

enum Collapsible {
    Information = '1',
    Actions = '2',
    Comment = '3',
    History = '4',
}

export const SliderPanel = memo((props: SliderPanelProps) => {
    const { t, i18n } = useTranslation();
    const userDetails = useSelector(selectLoggedInUserDetails);
    const { open, selectedFilters } = props;
    const { studType, deviceName, eventCode, plantId = '', occurredOn, eventTypeCode } = selectedFilters;
    const [params] = useState({
        faultCode: eventCode,
        plantId,
        selectedLanguage: i18n.language,
        systemType: selectedFilters?.systemType,
        eventTypeCode,
    });
    const [historyParams] = useState({
        faultCode: eventCode,
        studType,
        deviceName,
        systemType: selectedFilters?.systemType,
        eventTypeCode,
    });
    const [filterHistory, setfilterHistory] = useState<FaultActionType>(FaultActionType.All);

    const [collapsables, setCollapsables] = useState<any>({});
    const [itCollapsed, setItCollapsed] = useState<boolean>(false);

    useInjectReducer({ key: recommendedActionsKey, reducer: recommendedActionsReducer });
    useInjectSaga({ key: recommendedActionsKey, saga: recommendedActionsSaga });

    useInjectReducer({ key: recommendedActionSubmitsKey, reducer: recommendedActionSubmitsReducer });
    useInjectSaga({ key: recommendedActionSubmitsKey, saga: recommendedActionSubmitsSaga });

    useInjectReducer({ key: recommendedActionsHistorysKey, reducer: recommendedActionsHistorysReducer });
    useInjectSaga({ key: recommendedActionsHistorysKey, saga: getAllRecommendedActionsHistorysSaga });

    const dispatch = useDispatch();
    const recommendedActions: RecommendedAction = useSelector(selectRecommendedActions);
    const actionsHistory: FaultActions = useSelector(selectRecommendedActionsHistorys);
    const getRecommendedAction = useSelector(selectGetRecommendedAction);

    const loadingRecommened = useSelector(selectRecommendedActionsIsLoading);
    const filterOptions = ['All', 'Recommended Action', 'User Action', 'Comment'];
    const [userInfo] = useLocalStorage<any>(Constants.storageKeys.userDetails);

    useEffect(() => {
        if (open) {
            dispatch(recommendedActionsActions.recommendedActions(params));
            dispatch(recommendedActionsHistorysActions.getAllRecommendedActionsHistorys(historyParams));
        }
    }, [dispatch, params, open, historyParams]);

    const handleSubmit = (e: any) => {
        dispatch(recommendedActionSubmitsActions.recommendedActionSubmits(historyParams));
    };

    const popUpCloseHandle = (e) => {
        e.preventDefault && e.preventDefault();
        props.closePopup && props.closePopup();
    };

    const { recommendedAction = [] } = recommendedActions;
    const { description = '', extendedDescription = '' } = recommendedActions;
    const actions: Map<string, FaultActionView> = useMemo(
        () =>
            recommendedAction.reduce((acc, action) => {
                const { actionId = '' } = action;
                const recommendedChecked = actionsHistory?.some(
                    (item: FaultActionView) =>
                        item.actionId === `${actionId}` && item.actionType === FaultActionType.RecommendedAction,
                );
                const takenChecked = actionsHistory?.some(
                    (item: FaultActionView) =>
                        item.actionId === `${actionId}` && item.actionType === FaultActionType.UserAction,
                );
                acc.set(actionId, { ...action, recommendedChecked, takenChecked } as any);
                return acc;
            }, new Map<string, FaultAction>()),
        [recommendedAction, actionsHistory],
    );

    const getClassName = (level: any): string => {
        if (level >= 90) {
            return 'highly recommended';
        }
        if (level >= 70) {
            return 'moderately recommended';
        }
        if (level >= 60) {
            return 'lightly recommended';
        }
        if (level === 0) {
            return '';
        }
        return 'recommended';
    };

    const handleChange = (
        checked: { recommendedChecked?: boolean; takenChecked?: boolean },
        actionId: string,
        actionType: FaultActionType,
    ) => {
        const faultAction = actions.get(actionId);
        if (faultAction) {
            const payloadData: FaultActionView = {
                ...faultAction,
                ...checked,
                actionId: `${actionId}`,
                actionType,
                occurredOn,
                studType,
                deviceName,
                faultCode: eventCode,
                eventType: eventTypeCode,
                dirty: !faultAction.dirty,
                actionBy: userDetails.userId,
            };
            dispatch(recommendedActionsHistorysActions.updateRecommendedActionsHistoryItem(payloadData));
        }
    };

    const onCommentHandle = (value, actionType: FaultActionType) => {
        const actionComment = value;
        const actionKey = '';
        const payloadData: FaultAction = {
            actionType,
            studType,
            deviceName,
            eventCode,
            occurredOn,
            actionComment,
            actionKey,
            faultCode: eventCode,
            eventType: eventTypeCode,
            actionBy: userDetails.userId,
        };
        dispatch(recommendedActionsHistorysActions.updateRecommendedActionsHistoryItem(payloadData));
    };

    const getEnumNames = (val: FaultActionType) => {
        switch (val) {
            case '1':
                return 'Recommended Action';
            case '2':
                return 'User Action';
            case '3':
                return 'Comment';
            default:
                return 'All';
        }
    };

    const getActionDetail = (actionId) => getRecommendedAction(actionId)?.actionDetail;

    const renderHistory = () => {
        const itemIndex = filterOptions?.indexOf(filterHistory);
        let fullName: any = Object.values(userInfo)[0];
        return (
            actionsHistory && (
                <tbody>
                    {actionsHistory
                        .filter((filData) => {
                            if (itemIndex !== 0) {
                                return parseInt(filData.actionType) === itemIndex;
                            }
                            return filData;
                        })
                        .map((item) => {
                            return (
                                <tr>
                                    <td>
                                        <button className="history-btns">
                                            <span className="btn-text">{getEnumNames(item.actionType)}</span>
                                        </button>
                                    </td>
                                    <td>
                                        {getActionDetail(item.actionId)
                                            ? getActionDetail(item.actionId)
                                            : item.actionComment}
                                    </td>
                                    <td className="stanleyCol name-date-col">
                                        <span className="name">{fullName.fullName}</span>
                                        <span className="date">
                                            {moment(item.actionDate).format('YYYY-MM-DD HH:mm:ss')}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            )
        );
    };

    const renderRecommendedActions = () => {
        return (
            <div>
                <table className="x-cls-table-bordered">
                    <thead>
                        <tr className="action-header">
                            <th className=" action-detail">
                                {renderCollabsable(Collapsible.Actions)}
                                <span>Actions</span>
                            </th>

                            {!collapsables[Collapsible.Actions] && <th>Confidence Level</th>}
                            {!collapsables[Collapsible.Actions] && <th>Recommended</th>}
                            {!collapsables[Collapsible.Actions] && <th>Taken</th>}
                            {!!collapsables[Collapsible.Actions] && (
                                <>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                    <th>&nbsp;</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody
                        className={`table-main-body ${!!collapsables[Collapsible.Actions] ? 'slideup' : 'slidedown'}`}
                    >
                        {Array.from(actions.values()).map(
                            (
                                { actionDetail, actionId = '', recommendedChecked, takenChecked }: RecommendedData,
                                index: number,
                            ) => (
                                <tr key={`key-tr-${index}`} className="action-content">
                                    <td key={`key-tr-${index}-0`}>{actionDetail}</td>
                                    {/* <td className={getClassName(confidenceLevel)}>{confidenceLevel}</td> */}
                                    <td key={`key-tr-${index}-2`} className={getClassName(0)}>
                                        <Tooltip
                                            title="Need more usage to provide accurate confidence"
                                            placement="top-start"
                                        >
                                            <span>NA</span>
                                        </Tooltip>
                                    </td>
                                    <td key={`key-tr-${index}-4`}>
                                        <Checkbox
                                            checked={recommendedChecked}
                                            onChange={(event) =>
                                                handleChange(
                                                    { recommendedChecked: event.target.checked, takenChecked },
                                                    actionId,
                                                    FaultActionType.RecommendedAction,
                                                )
                                            }
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </td>
                                    <td key={`key-tr-${index}-5`}>
                                        <Checkbox
                                            checked={takenChecked}
                                            onChange={(event) =>
                                                handleChange(
                                                    { takenChecked: event.target.checked, recommendedChecked },
                                                    actionId,
                                                    FaultActionType.UserAction,
                                                )
                                            }
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const onHandleOnChange = (value: FaultActionType) => {
        setfilterHistory(value);
    };

    const onCollapse = (toggle: Collapsible) => {
        const collapse: boolean = !!collapsables[toggle];

        collapsables[toggle] = !collapse;

        setCollapsables(collapsables);
        setItCollapsed(!itCollapsed);
    };

    const renderCollabsable = (toggle: Collapsible, collapsible = true) => {
        const collapse: boolean = !!collapsables[toggle];

        if (!collapsible) {
            return undefined;
        }

        return (
            <span
                onClick={() => onCollapse(toggle)}
                className={`collapsable fa fa-chevron-${collapse ? 'right collapsed' : 'down'}`}
            />
        );
    };

    // onClose={toggleDrawer(anchor, false)}

    return (
        <div className={`main-slider `}>
            <div className=" main-slider stnly-sidebar-header">
                <div className="header-container">
                    <div className="header-label">
                        <h5 className="header-tile">
                            {loadingRecommened ? (
                                <CircularProgress color="secondary" />
                            ) : (
                                <span className="description-header">
                                    {eventCode} : {description}
                                </span>
                            )}
                        </h5>
                    </div>
                    <div className="close-container" onClick={popUpCloseHandle}>
                        <span className="close-panel">
                            {t(messages.close)} &nbsp;
                            <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
                {loadingRecommened ? (
                    <CircularProgress color="secondary" />
                ) : (
                    <div className="main-content">
                        <div className="divider"></div>
                        <div className="info-title">
                            {renderCollabsable(Collapsible.Information)}
                            <span className="sub-heading">{t(messages.informationPlaceholder)}</span>
                            <div
                                className={`info-title-box ${!!collapsables[Collapsible.Information] ? 'slideup' : 'slidedown'
                                    }`}
                            >
                                <p>{extendedDescription}</p>
                            </div>
                        </div>

                        <>{renderRecommendedActions()}</>
                        <div className="info-title">
                            <span>
                                {renderCollabsable(Collapsible.Comment)}
                                <span>{t(messages.addCommentsTitle)}</span>
                            </span>
                            <div className={` ${!!collapsables[Collapsible.Comment] ? 'slideup' : 'slidedown'}`}>
                                <input
                                    className="info-title-box"
                                    onChange={(e) => onCommentHandle(e.target.value, FaultActionType.Comment)}
                                    type="text"
                                    id="comment"
                                    name="comment"
                                />
                            </div>
                        </div>
                        {!collapsables[Collapsible.Comment] && (
                            <div className="add-comment-btn-div">
                                <button
                                    color="inherit"
                                    className="add-comment-btn"
                                    disabled={actionsHistory.length > 0 ? false : true}
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    <span className="btn-text">{t(messages.addCommentsBtn)}</span>
                                </button>
                            </div>
                        )}
                        <div className="divider"></div>
                        <div className="history-content">
                            <div className="title-filter">
                                <span className="history-title">
                                    {renderCollabsable(Collapsible.History, false)}
                                    <span>{t(messages.history)}</span>
                                </span>
                                <SelectField
                                    id="FilterByStudId"
                                    className={`x-cls-filter-history ${!!collapsables[Collapsible.History] ? 'slideright' : 'slideleft'
                                        }`}
                                    label={t(messages.filterBy)}
                                    options={filterOptions}
                                    disableClearable={true}
                                    defaultValue={FaultActionType.All}
                                    value={filterHistory}
                                    onChange={(value) => onHandleOnChange(value)}
                                />
                            </div>
                            <div
                                className={` history-body ${!!collapsables[Collapsible.History] ? 'slideup' : 'slidedown'
                                    }`}
                            >
                                <table className="history-table">{renderHistory()}</table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default SliderPanel;
