import './simple_resume.scss';
import CVData from '../../classes/cv_data';

import SimpleResumeDetails from './simple_resume_details';
import SimpleResumeHeader from './simple_resume_header';
import { getHeaderDataFromJson, getDetailsDataFromJson } from '../../utilities/getinfoData.ts';


export default function SimpleResume (cvData:any | JSON) {
  const CV_Data: CVData = new CVData(
      getHeaderDataFromJson(cvData),
      getDetailsDataFromJson(cvData));
  const FontApi: string = 'https://fonts.googleapis.com/css?family=Lato:400,300,700';

  return (
    <>
      <link href={ FontApi }  rel='stylesheet' type='text/css' />
        <div className="container">
          <SimpleResumeHeader cvData={ CV_Data } />
          <SimpleResumeDetails cvData={ CV_Data } />
        </div>
    </>
  )
}
