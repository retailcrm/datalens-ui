export enum Capability {
    AccessibleCollectionsRoot = 'accessible-collections-root',
    AccessibleSettings = 'accessible-settings',
    AccessibleWorkbookDuplication = 'accessible-workbook-duplication',
    ManageableConnections = 'manageable-connections',
}

export type CapabilityName = Capability | `${Capability}`;

const capabilities: Record<`${Capability}`, boolean> = {
    [Capability.AccessibleCollectionsRoot]: true,
    [Capability.AccessibleSettings]: true,
    [Capability.AccessibleWorkbookDuplication]: true,
    [Capability.ManageableConnections]: true,
};

type Listener = () => void;

const listeners = new Set<Listener>();

export const all = (): Record<Capability, boolean> => {
    return {...capabilities} as Record<Capability, boolean>;
};

export const has = (capability: CapabilityName): boolean => {
    return capabilities[capability];
};

export const toggle = (capability: CapabilityName, value: boolean) => {
    if (capabilities[capability] !== value) {
        capabilities[capability] = value;
        listeners.forEach((listener) => listener());
    }
};

export const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};
