import * as React from 'react';
import { render } from '@testing-library/react';
import moment from 'moment';

import { ParentLabel } from '..';
import { ReportingDataView } from 'models';

describe('<ParentLabel  />', () => {
    it('should match snapshot', () => {
        const loadingIndicator = render(<ParentLabel date={moment()} view={ReportingDataView.Weekly} />);
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
