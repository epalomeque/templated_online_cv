import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {default as cvData} from "./assets/cvdata.json";

function App() {
  const title = import.meta.env.VITE_APP_TITLE;
  // const dataFile = import.meta.env.VITE_JSON_FILE;
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{title}</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>
          JSON File <code>{cvData.personal_info.name} {cvData.personal_info.lastname}</code>
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
