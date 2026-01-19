import type {History} from 'history';
import {createBrowserHistory, createMemoryHistory} from 'history';

let history: History | undefined;

export const getHistory = () => {
    if (!history) {
        try {
            history = createBrowserHistory();
        } catch {
            history = createMemoryHistory();
        }
    }

    return history;
};

export const setHistory = (newHistory: History) => {
    history = newHistory;
};
