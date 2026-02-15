import './simple_resume.scss';
import { useAppSelector } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import SimpleResumeDetails from './simple_resume_details';
import SimpleResumeHeader from './simple_resume_header';

export default function SimpleResume() {
  const { header, details } = useAppSelector((state) => state.cv);
  const cvData = new CVData(header, details);

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
