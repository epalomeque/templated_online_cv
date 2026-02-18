import { useEffect, useRef } from 'react'
import './App.css'
import ResumeActions from './features/cv-editor/components/ResumeActions.tsx';
import ResumeActionsFooter from "./features/cv-editor/components/ResumeActionsFooter.tsx";
import SimpleResume from './features/resume-viewer/components/single-theme/SimpleResume.tsx';
import BootstrapResume from './features/resume-viewer/components/bootstrap-theme/BootstrapResume.tsx';
import { getHeaderDataFromJson, getDetailsDataFromJson, getResumeInfo } from "./utilities/getinfoData.ts";
import {getAppSettings} from "./utilities/getAppSettings.ts";
import { useAppDispatch, useAppSelector } from './store/hooks.ts';
import { setCVData, setLoading, setError, setTheme } from './store/cvSlice.ts';

function App() {
  const app_settings = getAppSettings();
  const app_title = app_settings.title || 'My Resume';
  const initialTheme = app_settings.theme || 'simple';
  
  const dispatch = useAppDispatch();
  const { isLoading, error, theme } = useAppSelector((state) => state.cv);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    
    dispatch(setLoading(true));
    dispatch(setTheme(initialTheme));
    getResumeInfo(app_settings.resumeUrl)
      .then((data: JSON) => {
        const header = getHeaderDataFromJson(data);
        const details = getDetailsDataFromJson(data);
        dispatch(setCVData({ header, details }));
      })
      .catch((err: Error) => {
        console.error('Error fetching resume data:', err);
        dispatch(setError(err.message));
      });
  }, [app_settings.resumeUrl, dispatch, initialTheme]);

  const renderResume = () => {
    switch (theme) {
      case 'bootstrap':
        return <BootstrapResume />;
      default:
        return <SimpleResume />;
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <h1>{ app_title }</h1>
        <p>Loading resume data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1 className="red-text">{ app_title }</h1>
        <p>Error loading resume data: { error }</p>
      </div>
    )
  }

  return (
    <>
      <ResumeActions title={ app_title } />
      {renderResume()}
      <ResumeActionsFooter title={ app_title } />
    </>
  )
}

export default App
