import { useState, useEffect } from 'react'
import './App.css'
import { getResumeInfo } from "./utilities/getinfoData.ts";
import SimpleResume from './components/single-theme/simple_resume.tsx';
import ResumeActions from './components/single-theme/ResumeActions.tsx';

function App() {
  const title = import.meta.env.VITE_APP_TITLE;
  const urlResumeData: string = '/cvdata.json';
  const [resumeData, setResumeData] = useState<JSON|any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getResumeInfo(urlResumeData)
      .then((data) => {
        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching resume data:', error);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="loader-container">
        <h1>{title}</h1>
        <p>Loading resume data...</p>
      </div>
    );
  }

  return (
    <>
      <ResumeActions 
        title={ title }
        resumeData={ resumeData }
      />
      {resumeData && <SimpleResume cvData={ resumeData } />}
    </>
  )
}

export default App
