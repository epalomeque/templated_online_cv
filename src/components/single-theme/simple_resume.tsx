import './simple_resume.scss';
import CVData from '../../classes/cv_data';

import SimpleResumeDetails from './simple_resume_details';
import SimpleResumeHeader from './simple_resume_header';
import SimpleResumePropsInterface from "../../interfaces/simpleResumeProps.ts";


export default function SimpleResume (cv_data:SimpleResumePropsInterface) {
  const cvData:CVData = cv_data.cv_data

  const FontApi: string = 'https://fonts.googleapis.com/css?family=Lato:400,300,700';
  return (
    <>
      <link href={ FontApi }  rel='stylesheet' type='text/css' />
        <div className="container">
          <SimpleResumeHeader cv_data={ cvData }  />
          <SimpleResumeDetails cv_data={ cvData } />
        </div>
    </>
  )
}
