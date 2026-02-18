# Templated Resume App

A modern, responsive online resume/CV built with React, TypeScript, Vite, and Handlebars.

## Features

- **Multiple Themes**: Choose between `simple`, `bootstrap`, and `dark-theme` (Tailwind)
- **JSON Editor**: Built-in editor to modify resume data with undo/redo, validation and file management
- **Template System**: Flexible architecture using Handlebars layouts and themes
- **Export Options**: Download as PDF, DOCX, or standalone HTML with embedded styles
- **Responsive Design**: Works on desktop and mobile devices
- **Open Source**: MIT License

## Installation

To get started with this project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/epalomeque/templated_online_cv.git
    cd templated_online_cv
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your data file:**
    ```bash
    cp public/cvdata.example.json public/cvdata.json
    ```

## Usage

### Development

To run the project in development mode with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Themes

The app includes several built-in themes:

| Theme | Framework | Description |
|-------|-----------|-------------|
| `simple` | Sass | Clean, minimalist design |
| `bootstrap` | Bootstrap 5 | Modern, responsive layout |
| `dark-theme` | Tailwind CSS | Dark mode dashboard style |

### Switching Themes

Use the **Theme Selector** dropdown in the header to switch between available themes instantly. You can also set the initial theme in the `.env` file via `VITE_APP_THEME`.

## JSON Editor

The built-in JSON editor allows you to modify your resume data directly from the browser:

- **Load**: Load a JSON file from your computer
- **Save**: Download the current JSON
- **Copy/Paste**: Copy to clipboard or paste from clipboard
- **Undo/Redo**: Revert or reapply changes
- **Validation**: Real-time JSON syntax validation with error highlighting

Access it from the "Acciones" menu.

## Environment Configuration

Create a `.env` file in the root directory with the following options:

```env
# App Configuration
VITE_APP_TITLE="My Online Resume"
VITE_RESUME_URL="/cvdata.json"

# Button Visibility
VITE_CONFIG_SHOW_CELLPHONE=true
VITE_CONFIG_SHOW_BTNDOC=true
VITE_CONFIG_SHOW_BTNPDF=true
VITE_CONFIG_SHOW_BTNEMAIL=true

# Theme: 'simple' or 'bootstrap'
VITE_APP_THEME=bootstrap

# GitHub URL
VITE_GITHUB_HOSTED_URL="https://github.com/yourusername/templated_online_cv"
```

## Adding New Themes

The app uses a modular theme-agnostic system. To add a new theme:

1.  **Define Templates**: Create `src/features/resume-viewer/templates/[name]/templates.ts` with:
    -   `layout`: Handlebars layout for the whole document.
    -   Individual section templates (`header`, `experience`, etc.).
    -   `styles`: Raw CSS for standalone export.
    -   `externalCss` / `externalScripts`: External resource links.
2.  **Create Component**: Add a React component in `src/features/resume-viewer/components/[name]/` that uses `Section` components with the new theme name.
3.  **Register Theme**:
    -   Add the name to `ThemeName` type in `handlebarsSetup.ts`.
    -   Update `loadTemplates`, `getThemeStyles`, etc., in `handlebarsSetup.ts`.
    -   Register label and ID in `themeService.ts`.
4.  **UI Integration**: Add the new component to the `renderResume` switch in `App.tsx`.

### Template Structure

Each theme needs these templates:
- `header` - Personal information header
- `experience` - Work experience section
- `education` - Education section
- `projects` - Projects section
- `skills` - Skills section
- `interests` - Interests section
- `language` - Languages section

## Project Structure

```
src/
├── features/
│   ├── cv-editor/           # JSON editor and actions
│   └── resume-viewer/       # Themes, templates and rendering
├── services/
│   ├── themeService.ts      # Theme management
│   ├── handlebarsSetup.ts   # Template compilation
│   └── errorMiddleware.ts   # Global error handling
├── store/                   # Redux state (cvSlice)
├── utilities/               # PDF, DOCX, HTML generators
└── interfaces/              # TypeScript definitions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
