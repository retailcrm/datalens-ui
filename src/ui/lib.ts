import '@gravity-ui/uikit/styles/styles.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css';
import 'ui/styles/base.scss';
// eslint-disable-next-line import/order
import 'ui/styles/variables.scss';
import 'ui/styles/split-pane-resizer.scss';
import 'ui/styles/theme.scss';

export {getStore, resetStore} from 'ui/store/configure';
export {
    createBrowserHistory,
    createHashHistory,
    createMemoryHistory,
    getHistory,
    setHistory,
    useRouter,
} from 'ui/navigation';
export {renderDatalens} from 'ui/datalens/render';

export {default as Page} from 'ui/datalens';
