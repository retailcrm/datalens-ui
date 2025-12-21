import {useEffect, useState} from 'react';

import {Capability, all, has, subscribe, toggle} from './capabilities';

export {Capability};

export const capabilities = {all, has, toggle};

/** React hook for accessing capabilities state. */
export const useCapabilities = (): Record<Capability, boolean> => {
    const [state, setState] = useState(all);

    useEffect(() => subscribe(() => setState(all())), []);

    return state;
};
