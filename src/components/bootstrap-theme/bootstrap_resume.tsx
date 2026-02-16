import { useMemo } from 'react';
import './bootstrap_resume.scss';
import { useAppSelector } from '../../store/hooks';
import CVData from '../../classes/cv_data';
import { renderSection } from '../../services/sectionRenderer';
import { ThemeName } from '../../services/handlebarsSetup';

interface SectionProps {
  type: string;
  title: string;
  cvData: CVData;
  theme: ThemeName;
}

function Section({ type, title, cvData, theme }: SectionProps) {
  const html = useMemo(() => renderSection(type, title, cvData, theme), [type, title, cvData, theme]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function BootstrapResume() {
  const { header, details, theme } = useAppSelector((state) => state.cv);
  const cvData = useMemo(() => new CVData(header, details), [header, details]);
  const currentTheme: ThemeName = theme || 'bootstrap';

  return (
    <div className="container-xl bootstrap-resume">
      <div className="row">
        <div className="col-12">
          <Section type="header" title="" cvData={cvData} theme={currentTheme} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <Section type="language" title="Languages" cvData={cvData} theme={currentTheme} />
          <Section type="experience" title="Experience" cvData={cvData} theme={currentTheme} />
          <Section type="education" title="Education" cvData={cvData} theme={currentTheme} />
        </div>
        <div className="col-12 col-md-6">
          <Section type="projects" title="Projects" cvData={cvData} theme={currentTheme} />
          <Section type="skills" title="Skills" cvData={cvData} theme={currentTheme} />
          <Section type="interests" title="Interests" cvData={cvData} theme={currentTheme} />
        </div>
      </div>
    </div>
  );
}
