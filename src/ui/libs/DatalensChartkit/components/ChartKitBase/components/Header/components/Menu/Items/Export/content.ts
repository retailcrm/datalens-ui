import type {ReactElement} from 'react';

import ReactDOM from 'react-dom';

const FALLBACK_CONTENT_WIDTH = 206;
const FORMAT_WIDTH = 27;
const TOAST_CONTAINER_ID = 'reference-toast';
const ELLIPSIS_SYMBOL = '\u2026';

export const truncateTextWithEllipsis = (text: string, toast: ReactElement, className: string) => {
    const toastContainer = document.createElement('div');
    toastContainer.setAttribute('id', TOAST_CONTAINER_ID);

    document.body.appendChild(toastContainer);

    ReactDOM.render(toast, toastContainer);

    const toastContent = toastContainer.querySelector<HTMLElement>(`.${className}`) as HTMLElement;

    if (!toastContent) {
        return FALLBACK_CONTENT_WIDTH;
    }

    const textConainer = toastContent.firstChild as HTMLElement;
    const parent = toastContent.parentElement as HTMLElement;

    const contentWidth = toastContent?.clientWidth;
    const parentPadding = parseInt(window.getComputedStyle(parent, null).paddingRight, 10);

    const contentMaxWidth = contentWidth - FORMAT_WIDTH - parentPadding;

    let result = text;
    textConainer.innerHTML = result;
    if (textConainer.offsetWidth > contentMaxWidth) {
        let startPosition = 0;
        let midPosition;
        let endPosition = text.length;

        while (startPosition < endPosition) {
            midPosition = Math.round((startPosition + endPosition) / 2);
            textConainer.innerHTML = text.substring(0, midPosition) + ELLIPSIS_SYMBOL;
            if (textConainer.offsetWidth <= contentMaxWidth) {
                startPosition = midPosition;
            } else {
                endPosition = midPosition - 1;
            }
        }
        result = text.substring(0, startPosition) + ELLIPSIS_SYMBOL;
    }
    document.body.removeChild(toastContainer);
    return result;
};
