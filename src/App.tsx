import './App.css'
import { default as cvData } from './assets/cvdata.json';
import SimpleResume from './components/single-theme/simple_resume.tsx';

function App() {
  const title = import.meta.env.VITE_APP_TITLE;

  return (
    <>
      <h1>{ title }</h1>
      <SimpleResume cvData={ cvData } />
    </>
  )
}

export default App
