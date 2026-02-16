import './bootstrap_resume.scss';
import { useAppSelector } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import BootstrapResumeDetails from './bootstrap_resume_details';
import BootstrapResumeHeader from './bootstrap_resume_header';

export default function BootstrapResume() {
  const { header, details } = useAppSelector((state) => state.cv);
  const cvData = new CVData(header, details);

  return (
    <div className="container-xl bootstrap-resume">
      <div className="row">
        <div className="col-12">
          <BootstrapResumeHeader cv_data={cvData} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <BootstrapResumeDetails cv_data={cvData} />
        </div>
      </div>
    </div>
  );
}
