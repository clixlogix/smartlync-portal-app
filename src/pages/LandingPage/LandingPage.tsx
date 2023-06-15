/**
 *
 * Plant
 *
 */
import React, { memo, useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { withSize } from 'react-sizeme';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import CarIcon from '@mui/icons-material/DriveEta';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { plantsReducer, plantsKey, plantsActions } from 'services/plant/plant-reducer';
import { selectPlants, selectPlantsIsLoading } from 'services/plant/plant-selectors';
import { plantsSaga } from 'services/plant/plant-saga';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { Plants, Plant, Filters, CarClass, FilterNames } from 'models';
import { Page, PageProps } from 'pages';
import { breadcrumbActions } from 'services/breadcrumb/breadcrumb-reducer';
import { messages } from './messages';
import { Pages } from 'constants/defaultDateConfig';
import { getDefaultFilterDate } from 'utils';
import moment from 'moment';
import Loader from 'components/Loader';
import { Typography } from '@mui/material';
import { capitalize } from 'lodash';
import './LandingPage.scss';
import { Box } from '@mui/material';

interface LandingPageProps extends PageProps {
    size?: { width: number; height: number };
}

export const LandingPage: Page<LandingPageProps> = memo((props: LandingPageProps) => {
    const dispatch = useDispatch();

    useInjectReducer({ key: plantsKey, reducer: plantsReducer });
    useInjectSaga({ key: plantsKey, saga: plantsSaga });

    const history = useHistory();
    let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0];
    const environment = window.location.href
        .replace('http://', '')
        .replace('https://', '')
        .split('.')[1]
        .toLocaleLowerCase();
    tenant = tenant === 'demo' && environment === 'stage' ? 'jlr' : tenant;

    const plants: Plants = useSelector(selectPlants);
    const isPlantsLoading: boolean = useSelector(selectPlantsIsLoading);
    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    const START_TIME = useMemo(() => moment(getDefaultFilterDate(Pages.LandingPage)), []);
    const toTime = START_TIME.clone().endOf('day');
    const fromTime = START_TIME.clone().subtract(6, 'days').startOf('day');
    // const plantsIsLoading: boolean = useSelector(selectPlantsIsLoading);
    const { t } = useTranslation();

    const filters = useMemo(() => {
        return {
            ...breadCrumbsDataType,
            fromTime,
            toTime,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breadCrumbsDataType]);

    useEffect(() => {
        dispatch(plantsActions.plants(filters));
    }, [dispatch, filters]);

    const [expanded, setExpanded] = useState<string>('');

    const linkToView = (plant: Plant = { name: 'plant' }, carClass?: CarClass) => {
        const { active, route } = plant;
        let filters: Filters = {};

        if (active && route) {
            if (plant?.id) {
                filters[FilterNames.plantId] = plant.id;
                localStorage.setItem('plant__id', plant?.id);
            }
            if (carClass?.id) {
                filters[FilterNames.carTypeId] = carClass.id;
            }
            const qs = new URLSearchParams(filters);
            const path = `${route}?${qs.toString()}`;
            dispatch(breadcrumbActions.getTypeBreadcrumbsFilters({ ...filters }));
            history.push(path);
        }
    };

    const setExpandCarClassList = (e, plantId: string) => {
        setExpanded(plantId === expanded ? '' : plantId);
        e.stopPropagation();
    };

    const onCarClassClick = (e, plant: Plant, carClass: CarClass) => {
        linkToView(plant, carClass);
        e.stopPropagation();
    };

    const renderJlrListBoxItems = (plant: Plant) => {
        return (
            <>
                {plant.technicalAvailability && (
                    <div className="list-card">
                        <span className="list-label">{t(messages.technicalAvail)}</span>
                        <p className="list-value">{(+plant.technicalAvailability).toFixed(2)}</p>
                    </div>
                )}
                {plant.cycleCount && (
                    <div className="list-card">
                        <span className="list-label">{t(messages.cycleCount)}</span>
                        <p className="list-value">{plant.cycleCount}</p>
                    </div>
                )}
                {plant.eventCount && (
                    <div className="list-card">
                        <span className="list-label">{t(messages.eventCount)}</span>
                        <p className="list-value">{plant.eventCount}</p>
                    </div>
                )}
                {plant.eventRate && (
                    <div className="list-card">
                        <span className="list-label">{t(messages.eventRate)}</span>
                        <p className="list-value">{plant.eventRate}</p>
                    </div>
                )}
                {plant.changeEventRate && (
                    <div className="list-card">
                        <span className="list-label">{t(messages.faultTrend)}</span>
                        <p className="list-value">
                            {Math.sign(+plant.changeEventRate) !== -1 ? (
                                <TrendingUpIcon style={{ color: '#D68430', fontSize: '30px' }}></TrendingUpIcon>
                            ) : (
                                <TrendingDownIcon style={{ color: 'green', fontSize: '30px' }} />
                            )}
                        </p>
                    </div>
                )}
            </>
        );
    };

    const renderPlant = (plant: Plant, index: number = 0): JSX.Element => {
        const { carClasses = [], id = '', active = false } = plant;
        const expandable = carClasses?.length > 3;

        const carListStyle = {} as any;
        let carList = carClasses.slice(0, 3);

        if (expandable && expanded === plant.id) {
            carListStyle.paddingRight = 20;
            carListStyle.flexFlow = 'row wrap';
            carListStyle.overflow = 'auto';
            carList = carClasses;
        }

        let displayName = [capitalize(plant?.tenant), plant?.name, plant?.location];
        return (
            <Div
                key={`x-key-plant-${index}`}
                className={`${plant.active ? 'active' : ''} x-cls-plant column-data`}
                onClick={() => linkToView(plant)}
            >
                <Div className="plant-info" style={{ backgroundImage: `url(${plant.thumbnail})`, height: '100%' }}>
                    <Div className="plant-details" style={{ height: '41%', width: '100%', position: 'absolute' }}>
                        <div
                            className="header-box"
                            style={{ overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}
                        >
                            <span style={{ fontSize: '16px', paddingLeft: '5px' }}>
                                {displayName.filter((x) => x?.trim()).join(', ')}
                            </span>
                            <span className="list-label top">
                                {t(messages.last_Updated)}: {plant.lastUpdated}
                            </span>
                        </div>
                        <div className="list-box">{renderJlrListBoxItems(plant)}</div>
                        <Div className={`car-class-list ${expanded === id ? 'expanded' : ''}`} style={carListStyle}>
                            {expandable && (
                                <IconButton
                                    aria-label="expand"
                                    className={'car-class-expand-btn'}
                                    onClick={(e) => setExpandCarClassList(e, id)}
                                    size="large"
                                >
                                    <LaunchIcon fontSize="small" className={'car-class-expand-btn-icon'} />
                                </IconButton>
                            )}
                            {carList?.map((carClass, index) => (
                                <Button
                                    key={`x-key-plant-btn-${index}`}
                                    disabled={!active}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CarIcon />}
                                    aria-label={carClass.name}
                                    onClick={(e) => onCarClassClick(e, plant, carClass)}
                                >
                                    {carClass.name}
                                </Button>
                            ))}
                        </Div>
                    </Div>
                </Div>
            </Div>
        );
    };

    const width = Number(props.size?.width);
    const plantCardWidth = 440;
    const plantCardContainerWidth = 20 + Math.min(3, Math.floor(width / plantCardWidth)) * plantCardWidth;

    return (
        <>
            <Helmet>
                <title>{t(messages.plantPageTitle)}</title>
                <meta name="description" content="Description of Plant" />
            </Helmet>

            <Div className="landingPageContent">
                {isPlantsLoading ? (
                    <Loader circle />
                ) : plants.length > 0 ? (
                    <Div className={'x-cls-plants'} style={{ width: plantCardContainerWidth }}>
                        {plants.map((plant: Plant, index: number) => renderPlant(plant, index))}
                    </Div>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            height: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom>
                            {t(messages.noPlants)}
                        </Typography>
                    </Box>
                )}
            </Div>
        </>
    );
});

const Div = styled.div``;

// export default LandingPage;
export const LandingPageDefault = withSize({ monitorHeight: true, monitorWidth: true })(LandingPage);
export default LandingPageDefault;
