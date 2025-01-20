import './App.css'
import { default as cvData } from "./assets/cvdata.json";
import SimpleResume from "./components/single-theme/simple_resume.tsx";

function App() {
  const title = import.meta.env.VITE_APP_TITLE;

  return (
    <>
      <h1>{title}</h1>
      <div className="card">
        <p>
          JSON File <code>{cvData.personal_info.name} {cvData.personal_info.lastname}</code>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <SimpleResume />
    </>
  )
}

export default App
