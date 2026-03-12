# Templated Resume App

A modern, responsive online resume/CV built with React, TypeScript, Vite, Redux Toolkit, and Handlebars.

## Features

- **Multiple Themes**: Choose between `simple`, `bootstrap`, and `dark-theme` (Tailwind)
- **Dual Editor**: Form-based editor with intuitive UI and JSON editor for advanced users
- **Template System**: Flexible architecture using Handlebars layouts and themes
- **Export Options**: Download as PDF, DOCX, or standalone HTML with embedded styles
- **Responsive Design**: Works on desktop and mobile devices
- **Spanish Localization**: Full Spanish interface and date formatting
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

Use the **hamburger menu** (☰) in the header to access the theme selector. You can also set the initial theme in the `.env` file via `VITE_APP_THEME`.

## Editor

The app provides two ways to edit your resume:

### Form Editor (Recommended)
- Intuitive form with labeled input fields
- Date pickers for dates (day/month/year selectors)
- Skills with level slider (1-10)
- Languages with proficiency dropdown (Nativo, C2, C1, B2, B1, A2, A1)
- Interests as interactive chips/pills
- Add/Remove buttons for all list items

### JSON Editor
For advanced users who prefer direct JSON editing:
- **Load**: Load a JSON file from your computer
- **Save**: Download the current JSON
- **Copy/Paste**: Copy to clipboard or paste from clipboard
- **Undo/Redo**: Revert or reapply changes
- **Validation**: Real-time JSON syntax validation with error highlighting

Access the editor by clicking the **"Editar CV"** button in the header.

## Date Formatting

All dates are displayed in Spanish format:
- **Birthdate**: Day, Month (full name), Year
- **Experience/Education**: Month-Year (e.g., "Enero 2024 - Marzo 2026")

## Section Titles

All section titles are displayed in Spanish:
- Experience → Experiencia Laboral
- Education → Educación
- Skills → Habilidades
- Projects → Proyectos
- Languages → Idiomas
- Interests → Intereses

## Environment Configuration

Create a `.env` file in the root directory with the following options:

```env
# App Configuration
VITE_APP_TITLE="Mi Currículum"
VITE_RESUME_URL="/cvdata.json"

# Button Visibility
VITE_CONFIG_SHOW_CELLPHONE=true
VITE_CONFIG_SHOW_BTNDOC=true
VITE_CONFIG_SHOW_BTNPDF=true
VITE_CONFIG_SHOW_BTNEMAIL=true

# Theme: 'simple', 'bootstrap', or 'dark-theme'
VITE_APP_THEME=simple

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
│   ├── cv-editor/           # Form editor, JSON editor and actions
│   │   └── components/      # CVEditorForm, ActionsMenu, etc.
│   └── resume-viewer/       # Themes, templates and rendering
│       ├── components/      # Theme-specific React components
│       └── templates/       # Handlebars templates per theme
├── services/
│   ├── themeService.ts      # Theme management
│   ├── handlebarsSetup.ts   # Template compilation and helpers
│   └── sectionRenderer.ts   # Section rendering logic
├── store/                   # Redux state (cvSlice)
├── utilities/               # PDF, DOCX, HTML generators
├── classes/                 # CVData class
└── interfaces/              # TypeScript definitions
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
