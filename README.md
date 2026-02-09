# Templated Resume App

A modern, responsive online resume/CV built with React, TypeScript, and Vite.

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

## Updating the Resume

The resume content is driven by a JSON file. To update your information:

1.  Navigate to the `public` directory.
2.  Open `cvdata.json`.
3.  Modify the JSON content with your own data (personal info, experience, education, skills, etc.).
4.  Save the file. The changes will be reflected in the application (if running in dev mode, it will reload automatically).

## Environment Configuration

You can customize the application title by creating a `.env` file in the root directory:

```env content
VITE_APP_TITLE="My Online Resume"
SHOW_CELLPHONE=false
```
