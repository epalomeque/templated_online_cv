/// <reference types="vite/client" />
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_RESUME_URL: string;
    readonly VITE_CONFIG_SHOW_CELLPHONE: boolean;
    readonly VITE_CONFIG_SHOW_BTNDOC: boolean;
    readonly VITE_CONFIG_SHOW_BTNPDF: boolean;
    readonly VITE_CONFIG_SHOW_BTNEMAIL: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />
