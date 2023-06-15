/**
 *
 * PlantLevelKpi
 *
 */

import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useResizeAware from 'react-resize-aware';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { messages } from './messages';

import './PlantLevelKpi.scss';

interface Props {}

export const PlantLevelKpi = memo((props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);
    const [resizeListener, sizes] = useResizeAware();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t, i18n } = useTranslation();

    const onLoad = () => {
        setLoading(false);
    };

    const lang = `formatLocale=${i18n.language}&language=${i18n.language}`;

    const height = parseInt(`${sizes.height}`, 0) - 100;

    return (
        <>
            <Helmet>
                <title>PlantLevelKpi</title>
                <meta name="description" content="Description of PlantLevelKpi" />
            </Helmet>

            <Div className="page-body stanleyCol">
                <Div className={`page-wrapper `}>
                    {resizeListener}
                    <iframe
                        title={t(messages.plantLevelKpiTitle)}
                        width={`${sizes.width}`}
                        height={`${height}`}
                        src={`https://app.powerbi.com/reportEmbed?reportId=4c1161f6-8be0-496c-83bf-b025ed69d20f&autoAuth=true&ctid=d4062de4-74ba-4730-a339-59645ae170de&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLWVhc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9&${lang}&filterPaneEnabled=false`}
                        frameBorder={'0'}
                        allowFullScreen={true}
                        onLoad={onLoad}
                    ></iframe>
                </Div>
            </Div>
        </>
    );
});

const Div = styled.div``;

export default PlantLevelKpi;
