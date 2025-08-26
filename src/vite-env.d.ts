interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_JSON_FILE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
