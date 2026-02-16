# Templated Resume App

A modern, responsive online resume/CV built with React, TypeScript, Vite, and Handlebars.

## Features

- **Multiple Themes**: Choose between `simple` and `bootstrap` themes
- **JSON Editor**: Built-in editor to modify resume data directly from the UI
- **Template System**: Extensible design using Handlebars templates
- **Export Options**: Download as PDF, DOCX, or send via email
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

The app includes two built-in themes:

| Theme | Description |
|-------|-------------|
| `simple` | Clean, minimalist design |
| `bootstrap` | Modern, responsive with Bootstrap 5 |

### Switching Themes

You can switch themes in two ways:

1. **From the UI**: Click the "Tema" button in the header
2. **From environment**: Set `VITE_APP_THEME=bootstrap` in `.env`

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

## Project Structure

```
src/
├── components/
│   ├── bootstrap-theme/     # Bootstrap theme
│   ├── resume-base/         # Shared UI components
│   └── single-theme/        # Simple theme
├── services/
│   ├── handlebarsSetup.ts  # Template configuration
│   └── sectionRenderer.ts   # Section rendering
├── templates/
│   ├── bootstrap-theme/    # Bootstrap templates
│   └── single-theme/       # Simple templates
├── store/                   # Redux store
└── interfaces/             # TypeScript interfaces
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
