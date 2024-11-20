import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './custom.css';
import './responsive.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import 'moment-timezone';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import utils from './utils/utils';
import initializeStores from './stores/storeInitializer';
import { Provider } from 'mobx-react';

declare var abp: any;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
utils.setLocalization();
abpUserConfigurationService.getAll().then((data) => {
    utils.extend(true, abp, data.data.result);
    abp.clock.provider = utils.getCurrentClockProvider(data.data.result.clock.provider);

    moment.locale(abp.localization.currentLanguage.name);

    if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
    }

    const stores = initializeStores();
    root.render(
        <Provider {...stores}>
            <App />
        </Provider>
    );
});

registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
