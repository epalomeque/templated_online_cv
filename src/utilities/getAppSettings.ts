import AppSettingsInterface from "../interfaces/app_settings_interface.ts";
import { stringToBoolean } from "./parsers/parsers.ts";

/**
 * Retrieves the application settings from environment variables.
 * 
 * @returns An object containing the application configuration.
 */
export function getAppSettings(): AppSettingsInterface {
    const app_config = import.meta.env;
    return {
        title: app_config.VITE_APP_TITLE || 'My Resume',
        resumeUrl: app_config.VITE_RESUME_URL || '/cvdata.json',
        showCellphone: stringToBoolean(app_config.VITE_CONFIG_SHOW_CELLPHONE),
        showBtnDoc: stringToBoolean(app_config.VITE_CONFIG_SHOW_BTNDOC),
        showBtnPdf: stringToBoolean(app_config.VITE_CONFIG_SHOW_BTNPDF),
        showBtnEmail: stringToBoolean(app_config.VITE_CONFIG_SHOW_BTNEMAIL),
        githubHostedUrl: app_config.VITE_GITHUB_HOSTED_URL || '',
        theme: (app_config.VITE_APP_THEME as 'simple' | 'bootstrap') || 'simple'
    }
}