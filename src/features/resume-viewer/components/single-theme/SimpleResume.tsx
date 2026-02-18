import { useMemo } from 'react';
import './simple_resume.scss';
import { useAppSelector } from '../../../../store/hooks';
import CVData from '../../../../classes/cv_data';
import { renderSection } from '../../../../services/sectionRenderer';
import { ThemeName } from '../../../../services/handlebarsSetup';

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

import type { RootState } from '../../../../store/store';

export default function SimpleResume() {
  const { header, details, theme } = useAppSelector((state: RootState) => state.cv);
  const cvData = useMemo(() => new CVData(header, details), [header, details]);
  const currentTheme: ThemeName = theme || 'simple';

  const FontApi: string = 'https://fonts.googleapis.com/css?family=Lato:400,300,700';
  return (
    <>
      <link href={FontApi} rel='stylesheet' type='text/css' />
      <div className="container">
        <Section type="header" title="" cvData={cvData} theme={currentTheme} />
        <div className="details">
          <Section type="language" title="Languages" cvData={cvData} theme={currentTheme} />
          <Section type="experience" title="Experience" cvData={cvData} theme={currentTheme} />
          <Section type="education" title="Education" cvData={cvData} theme={currentTheme} />
          <Section type="projects" title="Projects" cvData={cvData} theme={currentTheme} />
          <Section type="skills" title="Skills" cvData={cvData} theme={currentTheme} />
          <Section type="interests" title="Interests" cvData={cvData} theme={currentTheme} />
        </div>
      </div>
    </>
  );
}
