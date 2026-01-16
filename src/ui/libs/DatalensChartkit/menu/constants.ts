import {DL} from 'ui/constants/common';

export enum MenuType {
    Wizard = 'wizard',
    Widget = 'widget',
    PanePreview = 'panePreview',
    Dash = 'dash',
    Preview = 'preview',
    None = 'none',
    ChartRecipe = 'chart-recipe',
}

export const ICONS_MENU_DEFAULT_SIZE = DL.IS_MOBILE ? 18 : 16;
