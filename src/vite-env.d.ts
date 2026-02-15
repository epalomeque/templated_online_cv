/// <reference types="vite/client" />
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';
declare module '*.styl';

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_RESUME_URL: string;
    readonly VITE_CONFIG_SHOW_CELLPHONE: string;
    readonly VITE_CONFIG_SHOW_BTNDOC: string;
    readonly VITE_CONFIG_SHOW_BTNPDF: string;
    readonly VITE_CONFIG_SHOW_BTNEMAIL: string;
    readonly VITE_GITHUB_HOSTED_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

/// <reference types="vite/client" />
