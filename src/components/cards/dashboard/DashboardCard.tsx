import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import './DashboardCard.scss';

export interface DashboardCardProps {
    title?: string;
    subTitle?: string;
    className?: string;
    noData?: string;
    bodyClassName?: string;
    header?: JSX.Element;
    footer?: JSX.Element;
    body?: JSX.Element | JSX.Element[];
    children?: JSX.Element | JSX.Element[];
    settingsIcon?: string;

    onFilterClick?(): void;
}

const DashboardCard: React.FC<DashboardCardProps> = React.memo(
    ({
        className = '',
        bodyClassName = '',
        noData = 'No Data',
        onFilterClick,
        settingsIcon,
        title,
        subTitle,
        header,
        body,
        footer,
        children,
    }) => {
        let cardHeader: JSX.Element = <></>;
        const nodata = !(children || body);
        const cardBody = !nodata ? (
            <>
                {body}
                {children}
            </>
        ) : (
            <span className={'no-data'}>{noData}</span>
        );

        if (header || title) {
            cardHeader = header ? (
                header
            ) : (
                <div className={'x-cls-header-title'}>
                    <div className={'title-label'}>
                        <span className="title">{title}</span>
                        <span className="sub-title">{subTitle}</span>
                    </div>
                    <span className="filter">
                        {onFilterClick && (
                            <Button onClick={onFilterClick} variant="outlined">
                                <i
                                    style={{ color: '#ddd' }}
                                    className={`fa fa-2x ${settingsIcon ? settingsIcon : 'fa-cog'}`}
                                    aria-hidden="true"
                                ></i>
                            </Button>
                        )}
                    </span>
                </div>
            );
        }

        return (
            <Card className={`x-cls-dashboard-card ${className}`}>
                {cardHeader && <CardHeader className={'x-cls-dashboard-card-header'}>{cardHeader}</CardHeader>}
                <CardContent className={`x-cls-dashboard-card-body ${bodyClassName} ${nodata ? 'x-cls-no-data' : ''} `}>
                    {cardBody}
                </CardContent>
                {footer && (
                    <CardHeader
                        classes={{
                            root: 'MuiCardFooter-root',
                        }}
                        className="x-cls-dashboard-card-footer"
                    >
                        {footer}
                    </CardHeader>
                )}
            </Card>
        );
    },
);

export default DashboardCard;
