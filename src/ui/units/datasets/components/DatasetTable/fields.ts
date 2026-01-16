import type {DatasetField, DatasetSourceAvatar} from 'shared';

const getAvatarTitleLastPart = (avatarId: string, avatars?: DatasetSourceAvatar[]) => {
    const avatar = avatars?.find(({id}) => id === avatarId);
    if (!avatar) {
        return '';
    }

    const title = avatar.title.split('.').filter(Boolean);
    return title[title.length - 1];
};

export const getFieldSourceTitle = (field: DatasetField, avatars?: DatasetSourceAvatar[]) => {
    const avatarTitleLastPart = getAvatarTitleLastPart(field.avatar_id, avatars);
    return avatarTitleLastPart ? `${avatarTitleLastPart}.${field.source}` : field.source;
};
