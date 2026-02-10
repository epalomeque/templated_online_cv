import { useState, useEffect } from 'react'
import './App.css'
import { getResumeInfo } from "./utilities/getinfoData.ts";
import SimpleResume from './components/single-theme/simple_resume.tsx';
import ResumeActions from './components/resume-base/ResumeActions.tsx';

function App() {
  const APP_CONFIG = import.meta.env as ImportMetaEnv;
  console.log(APP_CONFIG);
  const TITLE:string = APP_CONFIG.VITE_APP_TITLE;
  const URL_RESUME_DATA: string = APP_CONFIG.VITE_RESUME_URL;

  const [resumeData, setResumeData] = useState<JSON|any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string|null>(null);

  useEffect(() => {
    getResumeInfo(URL_RESUME_DATA)
      .then((data:JSON) => {
        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching resume data:', error);
        setLoading(false);
        setLoadError(error.message);
      });
  }, [URL_RESUME_DATA]);


  if (loading) {
    return (
      <div className="loader-container">
        <h1>{ TITLE }</h1>
        <p>Loading resume data...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="error-container">
        <h1 className="red-text">{ TITLE }</h1>
        <p>Error loading resume data: { loadError }</p>
      </div>
    )
  }

  return (
    <>
      { !loading && !loadError && resumeData &&
        <ResumeActions
            title={ TITLE }
            resumeData={ resumeData }
        />
      }
      { !loading && !loadError && resumeData &&
          <SimpleResume cvData={ resumeData } />
      }
    </>
  )
}

export default App
