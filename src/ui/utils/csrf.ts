const getMeta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name=${name}]`);

export const getCSRFToken = () => getMeta('csrf-token')?.content ?? null;
