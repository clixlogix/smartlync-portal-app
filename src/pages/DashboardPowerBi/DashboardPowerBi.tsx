/**
 *
 * DashboardPowerBi
 *
 */

import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RadioGroup from '@mui/material/RadioGroup';
import RadioBtn from '@mui/material/Radio';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import styled from 'styled-components/macro';
import { SizeMe } from 'react-sizeme';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { dashboardsReducer, dashboardsKey } from 'services/dashboard/dashboard-reducer';
import { selectDashboards } from 'services/dashboard/dashboard-selectors';
import { dashboardsSaga } from 'services/dashboard/dashboard-saga';
import { RouteItem, RouteItems } from 'services/dashboard/routes';

import './DashboardPowerBi.scss';

interface Props {}

export const DashboardPowerBi = memo((props: Props) => {
    useInjectReducer({ key: dashboardsKey, reducer: dashboardsReducer });
    useInjectSaga({ key: dashboardsKey, saga: dashboardsSaga });

    const sideMenuItems = useSelector(selectDashboards) || [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();
    // const { id  } = useParams() as any;
    const id = window.location.pathname.replace('/dashboards/', '').trim();

    const { language = 'de' } = i18n;
    const [fullscreen, setFullscreen] = useState<string>('');

    let urlLoaded = 0;

    const lang = `formatLocale=${language}&language=${language}`;

    const onLoad = (evt: any, urlCnt: number = 0) => {
        urlLoaded++;

        setLoading(urlLoaded < urlCnt);
    };

    const fullscreenBtnClicked = (evt) => {
        const { value = '' } = evt.target;

        switch (value) {
            case 'btn-2':
                setFullscreen('');
                break;
            case 'btn-1':
            default:
                break;
        }
    };

    const renderDashboardFrame = (urls: string[] = []) => {
        const numUrls = urls.length;

        if (numUrls === 1) {
            return (
                <SizeMe monitorHeight>
                    {({ size }) => {
                        const { height = 0, width = 0 } = size as any;
                        return (
                            <div className={' frame-wrapper '} style={{ height, width, margin: 'auto auto' }}>
                                <Iframe
                                    className={'fullscreen'}
                                    title={label}
                                    width={`${width - 2}`}
                                    height={`${height - 2}`}
                                    src={`${urls[0]}&${lang}`}
                                    frameBorder={'0'}
                                    allowFullScreen={true}
                                    marginHeight={1}
                                    marginWidth={1}
                                    onLoad={(e) => onLoad(e, -1)}
                                />
                            </div>
                        );
                    }}
                </SizeMe>
            );
        }

        return (
            <div className={' frame-wrapper '}>
                {urls.map(
                    (frame: string, index: number): React.ReactNode => (
                        <div
                            key={`key-frame-${index}`}
                            className=" frame-item-wrapper "
                            style={{}}
                            onClick={() => setFullscreen(frame)}
                        >
                            <Div
                                className={`summary-dashboard img-${index + 1}`}
                                onClick={() => setFullscreen(frame)}
                            />
                            <Button className={'expand-btn'} onClick={() => setFullscreen(frame)}>
                                <SettingsOverscanIcon />
                            </Button>
                        </div>
                    ),
                )}
                <div className=" frame-item-wrapper new-frame" style={{}}>
                    <Div className={`summary-dashboard img-0`}>
                        <AddIcon />
                    </Div>
                </div>
            </div>
        );
    };

    const getDashboard = (id: string = '0'): RouteItem | undefined => {
        const routeItems: RouteItems =
            sideMenuItems?.find((d) => d?.route === '/dashboards')?.children || ([] as RouteItems);

        return routeItems.find((d) => `${d.id}` === `${id}`);
    };

    const dashboard = getDashboard(id);

    const { label = '', description = '', url = [] } = {
        ...dashboard,
    };

    let theUrls: string[] = Array.isArray(url) ? url : [url];

    if (fullscreen && url.length > 1) {
        theUrls = [fullscreen];
    }

    return (
        <>
            <Helmet>
                <title>{t(label)}</title>
                <meta name="description" content={`"${description}"`} />
            </Helmet>

            <Div className="x-cls-dashboard-body page-body stanleyCol">
                {url.length > 1 && (
                    <Div className={'toolbar btn-bar'}>
                        {!!fullscreen && (
                            <RadioGroup
                                className={'btn-grp full-screen-selection-btn-grp'}
                                onChange={fullscreenBtnClicked}
                                value={!fullscreen ? 'btn-2' : 'btn-1'}
                            >
                                <RadioBtn
                                    className={'btn'}
                                    icon={<FullscreenIcon color={'secondary'} />}
                                    checkedIcon={<FullscreenIcon color={'primary'} />}
                                    value="btn-1"
                                    inputProps={{ 'aria-label': 'Checkbox A' }}
                                />
                                <RadioBtn
                                    className={'btn'}
                                    icon={<FullscreenExitIcon color={'secondary'} />}
                                    checkedIcon={<FullscreenExitIcon color={'primary'} />}
                                    value="btn-2"
                                    inputProps={{ 'aria-label': 'Checkbox A' }}
                                />
                            </RadioGroup>
                        )}
                    </Div>
                )}
                <Div className={`page-wrapper `}>{renderDashboardFrame(theUrls)}</Div>
            </Div>
        </>
    );
});

const Div = styled.div``;
const Iframe = styled.iframe``;

export default DashboardPowerBi;
