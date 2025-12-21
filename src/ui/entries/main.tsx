import 'i18n';
import {MobileProvider, ThemeProvider} from '@gravity-ui/uikit';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {Provider, useSelector} from 'react-redux';
import {HotkeysProvider} from 'react-hotkeys-hook';

import DialogManager from 'components/DialogManager/DialogManagerContainer';
import {registerSDKDispatch} from 'libs/schematic-sdk/parse-error';
import {Utils, DL} from 'ui';

import DatalensPage from 'datalens';
import {renderDatalens} from 'datalens/render';
import {getStore, resetStore} from 'ui/store';
import {selectThemeSettings} from 'store/selectors/user';
import {createHashHistory, getHistory, setHistory} from 'ui/navigation';
import {getOverridedTheme} from 'ui/utils/getOverridedTheme';

import {HOTKEYS_SCOPES} from 'constants/misc';

import '@gravity-ui/uikit/styles/styles.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';
import 'ui/styles/base.scss';
import 'ui/styles/variables.scss';
import 'ui/styles/split-pane-resizer.scss';
import 'ui/styles/theme.scss';

let currentRootElement: HTMLElement | null = null;

export {Capability, capabilities} from 'ui/capabilities';

export function mount(rootElement: HTMLElement, homePathname: string) {
    setHistory(createHashHistory());

    currentRootElement = rootElement; // Store the element
    const Content = () => {
        const theme = getOverridedTheme('light');
        const themeSettings = useSelector(selectThemeSettings);

        return (
            <ThemeProvider
                theme={theme}
                systemLightTheme={themeSettings?.systemLightTheme}
                systemDarkTheme={themeSettings?.systemDarkTheme}
            >
                <MobileProvider mobile={DL.IS_MOBILE}>
                    <HotkeysProvider initiallyActiveScopes={[HOTKEYS_SCOPES.GLOBAL]}>
                        <React.Fragment>
                            <DialogManager />
                            <DatalensPage homePathname={homePathname} />
                        </React.Fragment>
                    </HotkeysProvider>
                </MobileProvider>
            </ThemeProvider>
        );
    };

    const renderApp = () => {
        Utils.setup();

        const history = getHistory();
        const store = getStore();

        registerSDKDispatch(store.dispatch);

        ReactDOM.render(
            <Router history={history}>
                <Provider store={store}>
                    <Content />
                </Provider>
            </Router>,
            rootElement,
        );
    };

    renderDatalens(renderApp, {});
}

export function unmount(rootElement: HTMLElement | null) {
    // Use the provided element or the last one we mounted to
    const targetElement = rootElement || currentRootElement;
    if (targetElement) {
        try {
            ReactDOM.unmountComponentAtNode(targetElement);
            if (targetElement === currentRootElement) {
                currentRootElement = null; // Clear the stored root if it was the one unmounted
            }

            resetStore();
        } catch (error) {
            console.error('Error unmounting DataLens main.tsx:', error);
        }
    }
}
