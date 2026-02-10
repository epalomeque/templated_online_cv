import { useState, useEffect } from 'react'
import './App.css'
import CVData from "./classes/cv_data.ts";
import ResumeActions from './components/resume-base/ResumeActions.tsx';
import ResumeActionsFooter from "./components/resume-base/ResumeActionsFooter.tsx";
import SimpleResume from './components/single-theme/simple_resume.tsx';
import { getCVDataFromJson, getResumeInfo } from "./utilities/getinfoData.ts";
import {getAppSettings} from "./utilities/getAppSettings.ts";


function App() {
  const app_settings = getAppSettings();
  const app_title = app_settings.title || 'My Resume';

  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string|null>(null);
  const [cvData, setCvData] = useState<CVData|null>(null);

  useEffect(() => {
    getResumeInfo(app_settings.resumeUrl)
      .then((data:JSON) => {
        setCvData(getCVDataFromJson(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching resume data:', error);
        setLoading(false);
        setLoadError(error.message);
      });
  }, [app_settings.resumeUrl]);

  if (loading) {
    return (
      <div className="loader-container">
        <h1>{ app_title }</h1>
        <p>Loading resume data...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="error-container">
        <h1 className="red-text">{ app_title }</h1>
        <p>Error loading resume data: { loadError }</p>
      </div>
    )
  }

  return (
    <>
      { !loading && !loadError && cvData && (
          <>
            <ResumeActions title={ app_title } cv_data={cvData} />
            <SimpleResume cv_data={ cvData } />
            <ResumeActionsFooter title={ app_title } cv_data={ cvData }/>
          </>
      )}
    </>
  )
}

export default App
