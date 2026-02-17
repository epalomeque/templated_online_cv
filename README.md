# Templated Resume App

A modern, responsive online resume/CV built with React, TypeScript, Vite, and Handlebars.

## Features

- **Multiple Themes**: Choose between `simple` and `bootstrap` themes with live switching
- **Template System**: Extensible design using Handlebars templates
- **JSON Editor**: Built-in editor to modify resume data directly from the UI
  - Load/Save JSON files
  - Copy/Paste support
  - Undo/Redo history
  - Real-time validation with error highlighting
- **Export Options**: 
  - Download as PDF
  - Download as DOCX
  - Download as standalone HTML (with embedded styles)
  - Send via email
- **Responsive Design**: Works on desktop and mobile devices
- **Build Optimization**: Code-splitting for better performance
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

The app includes two built-in themes:

| Theme | Description |
|-------|-------------|
| `simple` | Clean, minimalist design with Lato font |
| `bootstrap` | Modern, responsive with Bootstrap 5 grid |

### Switching Themes

You can switch themes in two ways:

1. **From the UI**: Click the "Tema" button in the header - changes instantly
2. **From environment**: Set `VITE_APP_THEME=bootstrap` or `VITE_APP_THEME=simple` in `.env`

## JSON Editor

The built-in JSON editor allows you to modify your resume data directly from the browser. Access it from the "Acciones" menu.

### Features:
- **Load**: Load a JSON file from your computer
- **Save**: Download the current JSON to a file
- **Copy/Paste**: Copy to clipboard or paste from clipboard
- **Undo/Redo**: Full history support (up to 50 states)
- **Validation**: Real-time JSON syntax validation with line/column error reporting

### Editor Controls:
- Buttons: Load, Copy, Paste, Undo, Redo
- Update button only enabled when JSON is valid

## Export Options

The app provides multiple export formats:

| Format | Description |
|--------|-------------|
| **PDF** | Download as PDF document |
| **DOCX** | Download as Word document |
| **HTML** | Download as standalone HTML file with embedded styles |
| **Email** | Open email client with CV data |

### HTML Export

The HTML export generates a completely self-contained HTML file:
- All styles embedded (no external dependencies except Font Awesome CDN)
- Maintains the exact same appearance as the web version
- Works offline
- Filename format: `cv-[theme]-[date].html`

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

The app uses Handlebars for templating, making it easy to add new themes:

1. **Create templates**: Add new templates in `src/templates/new-theme/templates.ts`
2. **Register templates**: Add them to `src/services/handlebarsSetup.ts`
3. **Create styles**: Add SCSS in `src/components/new-theme/`
4. **Create component**: Add the React component in `src/components/new-theme/`

### Template Structure

Each theme needs these templates:
- `header` - Personal information header
- `experience` - Work experience section
- `education` - Education section
- `projects` - Projects section
- `skills` - Skills section
- `interests` - Interests section
- `language` - Languages section

### Theme Helper Functions

Available Handlebars helpers:
- `{{#if hasItems}}` - Check if section has data
- `{{#each items}}` - Iterate over items
- `{{#if this}}checked{{/if}}` - Conditional checked attribute

## Project Structure

```
src/
├── components/
│   ├── bootstrap-theme/     # Bootstrap theme (2 files)
│   ├── resume-base/         # Shared UI components
│   └── single-theme/        # Simple theme (2 files)
├── services/
│   ├── handlebarsSetup.ts  # Handlebars configuration & template loading
│   └── sectionRenderer.ts  # Section rendering service
├── templates/
│   ├── bootstrap-theme/    # Bootstrap Handlebars templates
│   └── single-theme/       # Simple Handlebars templates
├── store/                   # Redux store
├── utilities/              # Helper functions
│   └── generateHtml.ts    # HTML export utility
└── interfaces/             # TypeScript interfaces
```

## Technologies

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **Redux Toolkit** - State management
- **Handlebars** - Template engine
- **Bootstrap 5** - CSS framework (bootstrap theme)
- **jsPDF + docx** - Document generation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
