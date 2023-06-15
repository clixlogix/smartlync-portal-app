/**
 *
 * PageHeader
 *
 */
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import { useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import EluLogoDark from 'assets/images/EluLogoDark.svg';
import EluLogoLight from 'assets/images/EluLogoLight.svg';
import Breadcrumb, { BreadcrumbLink, BreadcrumbLinks } from 'components/Breadcrumb';
import { LanguageSwitch } from 'components/LanguageSwitch';
import { LanguageSwitchType } from 'components/LanguageSwitch/LanguageSwitch';
import { MenuOption } from 'components/Menu';
import { NavProfile } from 'components/NavProfile';
import { SystemType } from 'constants/staticValues';
import { CarTypes, FilterNames, Filters, Plants, Tenant, TimeZone } from 'models';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { actions as authActions, auth, reducer as authReducer } from 'services/auth/auth-reducer';
import { breadcrumbActions, breadcrumbKey, breadcrumbReducer } from 'services/breadcrumb/breadcrumb-reducer';
import { selectBreadcrumbFilters } from 'services/breadcrumb/breadcrumb-selectors';
import { selectCarTypes } from 'services/car-type/car-type-selectors';
import { selectPlants } from 'services/plant/plant-selectors';
import { getAllTimeZonesSaga } from 'services/time-zone/sagas/time-zone-saga-get-all';
import { timeZoneActions, timeZoneKey, timeZoneReducer } from 'services/time-zone/time-zone-reducer';
import { selectTimeZones } from 'services/time-zone/time-zone-selectors';
import styled from 'styled-components/macro';
import { changeTheme, reducer as changeThemeReducer, selectThemeKey, themeSliceKey } from 'styles/theme/slice';
import { ThemeKeyType } from 'styles/theme/types';
import { saveTheme } from 'styles/theme/utils';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import './PageHeaderNew.scss';
import { Images } from '../../constants';
import { Tenants } from 'constants/defaultDateConfig';

interface Props {
    title?: string;
    subTitle?: string;
    loading?: boolean;
    className?: string;
    location?: any;
    onLangChange?(value);
    onClick?(crumb: BreadcrumbLink | string | Filters);
    isOpen: boolean;
    setIsOpen: (sideBarState: boolean) => void;
}

export const PageHeaderNew = memo((props: Props) => {
    const { onLangChange, isOpen, setIsOpen } = props;
    const dispatch = useDispatch();
    useInjectReducer({ key: breadcrumbKey, reducer: breadcrumbReducer });

    useInjectReducer({ key: timeZoneKey, reducer: timeZoneReducer });
    useInjectSaga({ key: timeZoneKey, saga: getAllTimeZonesSaga });
    useInjectReducer({ key: themeSliceKey, reducer: changeThemeReducer });

    const { carTypes = [] } = { carTypes: useSelector(selectCarTypes) as CarTypes };
    let tenant = window.location.href.replace('http://', '').replace('https://', '').split('.')[0].toLocaleLowerCase();

    tenant = tenant === Tenants.V1DAIMLER ? 'daimler' : tenant;

    const plants: Plants = useSelector(selectPlants);
    const history = useHistory();
    const locationPath = useLocation();
    const { i18n, t } = useTranslation();
    const [isHomeScreen, setIsHomeScreen] = useState<boolean>(false);

    const logoutToolTip = t('Sidebar.Logout');
    const selectTimeZone: TimeZone = useSelector(selectTimeZones);
    const { abbr = '', utc = '' } = selectTimeZone;
    const location = utc ? utc[0] : '';

    var index = location.indexOf('/');
    var country = location.substr(0, index) || 'UTC';
    var city = location.substr(index + 1) ? location.substr(index + 1) + ',' : '';

    const breadCrumbsDataType = useSelector(selectBreadcrumbFilters);

    useEffect(() => {
        const { pathname } = locationPath;
        if (pathname === '/home' || pathname === '') {
            setIsHomeScreen(true);
        } else {
            setIsHomeScreen(false);
        }
    }, [locationPath]);

    const systemType = localStorage.getItem('systemType');
    const { plantId } = breadCrumbsDataType;
    useEffect(() => {
        let crumb = {
            systemType: 'SWS',
            plantId: plants[0]?.id?.toString() || '',
        };

        if (plantId) {
            crumb.plantId = plantId;
        }
        if (systemType) {
            crumb.systemType = systemType;
        }
        dispatch(breadcrumbActions.getTypeBreadcrumbsFilters({ ...(crumb as Filters) }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            timeZoneActions.getAllTimeZones({
                [FilterNames.systemType]: systemType,
                [FilterNames.plantId]: plantId,
            }),
        );
    }, [dispatch, plantId, systemType]);

    useInjectReducer({ key: auth, reducer: authReducer });

    const onProfileMenu = (option: MenuOption) => {
        switch (option?.value) {
            case 'logout':
                dispatch(authActions.logout());
                history.push('/');
                break;
            case 'Profile':
            case 'Settings':
            default:
                break;
        }
    };

    const handleLanguageChange = (onLang: string) => {
        const language = onLang;
        i18n.changeLanguage(language);
        if (onLangChange) {
            onLangChange(onLang);
        }
    };

    const handleSideBarOpen = (sideBarState) => {
        setIsOpen(sideBarState);
    };

    const filters: any = useMemo(
        () => ({
            [FilterNames.carTypeId]: breadCrumbsDataType.carType ? breadCrumbsDataType.carType : '0',
            [FilterNames.systemType]: breadCrumbsDataType.systemType ? breadCrumbsDataType.systemType : SystemType.SWS,
        }),
        [breadCrumbsDataType],
    );

    const crumbs: BreadcrumbLinks = useMemo(() => {
        let plant__id: any = localStorage.getItem('plant__id');
        // if (!plant__id) {
        //     plant__id = plants[0].id;
        //     localStorage.setItem('plant__id', plant__id);
        // }
        const selected = plants.filter((plant) => plant.id === plant__id);
        const retVal = [
            {
                name: FilterNames.factory,
                menu: selected[0] && selected[0]?.name,
                options: plants.map(({ name }) => name),
                inactive: false,
            },
            {
                name: FilterNames.carTypeId,
                menu: carTypes.find(({ id }) => id === filters[FilterNames.carTypeId])?.name || carTypes[0]?.name,
                options: carTypes.map(({ name = '' }) => name),
                inactive: false,
            },
        ];
        return retVal;
    }, [carTypes, filters, plants]);

    const sysCrumbs: BreadcrumbLinks = useMemo(() => {
        const retVal = [
            {
                name: FilterNames.systemType,
                menu: filters[FilterNames.systemType],
                options: ['SWS', 'SPR', 'SAT'],
            },
        ];
        return retVal;
    }, [filters]);

    const onBreadcrumbChange = (crumb: string | Filters) => {
        if (typeof crumb === 'string') {
            // a link was selected to route to page
            return;
        }

        if (crumb[FilterNames.carTypeId]) {
            const carId = carTypes.find(({ name }) => name === crumb[FilterNames.carTypeId])?.id;

            if (carId) {
                crumb[FilterNames.carTypeId] = carId;
            }
        }

        if (crumb[FilterNames.factory]) {
            const factory = plants.find(({ name }) => name === crumb[FilterNames.factory])?.id;
            if (factory) {
                crumb[FilterNames.plantId] = factory;
            }
        }
        dispatch(breadcrumbActions.getTypeBreadcrumbsFilters({ ...(crumb as Filters) }));
    };
    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const value = (checked ? 'dark' : 'light') as ThemeKeyType;
        saveTheme(value);
        dispatch(changeTheme(value));
    };

    const theme = useSelector(selectThemeKey);
    const themeMode: 'light' | 'dark' = useTheme().palette.mode;
    // const svg: 'light' | 'dark' = useTheme().palette.mode;

    return (
        <AppBar position="static">
            <Grid container sx={{ alignItems: 'center' }} spacing={2}>
                <Grid item sx={{ height: 56 }}>
                    <Div className={`hamburger-menu ${isHomeScreen ? 'disabled' : ''} `}>
                        {!isOpen ? (
                            <MenuIcon
                                sx={{
                                    cursor: 'pointer',
                                    color: themeMode === 'light' ? '#2F61BF' : 'rgba(255, 255, 255, 0.56)',
                                }}
                                onClick={() => handleSideBarOpen(!isOpen)}
                            />
                        ) : (
                            <CloseIcon
                                sx={{
                                    cursor: 'pointer',
                                    color: themeMode === 'light' ? '#2F61BF' : 'rgba(255, 255, 255, 0.56)',
                                }}
                                onClick={() => handleSideBarOpen(!isOpen)}
                            />
                        )}
                    </Div>
                </Grid>
                <Grid item sx={{ height: 56 }}>
                    <Div className="elu-logo">
                        <Img
                            src={themeMode === 'light' ? EluLogoLight : EluLogoDark}
                            alt={'logo'}
                            style={{ height: '16px' }}
                        />
                        <Breadcrumb
                            filters={{ ...filters }}
                            crumbs={sysCrumbs}
                            crumbThemeActiveBool
                            onClick={onBreadcrumbChange}
                        />
                    </Div>
                </Grid>
                {tenant !== 'demo' && (
                    <Grid item sx={{ height: 56, display: 'flex', alignItems: 'center' }}>
                        {tenant === Tenants.JLR && (
                            <>
                                <Img src={Images[Tenants.JLR]} alt={'logo'} style={{ height: 56 }} />
                                {tenant === Tenants.JLR && (
                                    <Img src={Images['LandRover']} alt={'logo'} style={{ height: 56 }} />
                                )}
                            </>
                        )}
                        {tenant === Tenants.RIVIAN && (
                            <Img
                                src={themeMode === 'dark' ? Images.RivianDarkLogo : Images.RivianLightLogo}
                                alt={'logo'}
                                style={{ height: 20 }}
                            />
                        )}
                    </Grid>
                )}

                {!isHomeScreen && (
                    <>
                        <Grid item>
                            <Chip
                                sx={{ width: '100%' }}
                                icon={<PublicIcon />}
                                label={`${abbr} - ${city} ${country} `}
                            />
                        </Grid>
                        <Grid item>
                            <Breadcrumb
                                className={`page-header-breadcrumb ${isHomeScreen ? 'hide' : ''} `}
                                filters={{ ...filters }}
                                crumbs={crumbs}
                                onClick={onBreadcrumbChange}
                            />
                        </Grid>
                    </>
                )}

                <Grid item sm></Grid>
                <Grid item>
                    {process.env.REACT_APP_ENVIRONMENT === 'development' && (
                        <Switch checked={theme === 'dark'} onChange={handleThemeChange} aria-label="theme switch" />
                    )}
                </Grid>
                <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <LanguageSwitch onLangChange={handleLanguageChange} switchType={LanguageSwitchType.DropDown} />
                </Grid>
                <Grid item sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <NavProfile onMenu={onProfileMenu} />
                </Grid>
                <Grid item sx={{ height: 56 }}>
                    <Div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '16px',
                        }}
                    >
                        <Tooltip title={logoutToolTip} placement="bottom">
                            <LogoutIcon
                                sx={{
                                    color: themeMode === 'light' ? '#2F61BF' : 'rgba(255, 255, 255, 0.56)',
                                    width: 20,
                                    height: 18,
                                }}
                                onClick={() => {
                                    dispatch(authActions.logout());
                                    history.push('/');
                                }}
                            />
                        </Tooltip>
                    </Div>
                </Grid>
            </Grid>
        </AppBar>
    );
});

const Div = styled.div``;
const Img = styled.img``;

export default PageHeaderNew;
