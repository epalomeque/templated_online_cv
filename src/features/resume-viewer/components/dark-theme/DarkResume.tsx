import { useMemo } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import CVData from '../../../../classes/cv_data';
import { renderSection } from '../../../../services/sectionRenderer';
import { ThemeName } from '../../../../services/handlebarsSetup';
import type { RootState } from '../../../../store/store';

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

export default function DarkResume() {
  const { header, details, theme } = useAppSelector((state: RootState) => state.cv);
  const cvData = useMemo(() => new CVData(header, details), [header, details]);
  const currentTheme: ThemeName = theme || 'dark-theme';

  return (
    <div className="dark-theme dark-resume">
      <Section type="header" title="" cvData={cvData} theme={currentTheme} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto p-4 sm:p-8">
        <div className="md:col-span-1 space-y-8">
          <Section type="language" title="Languages" cvData={cvData} theme={currentTheme} />
          <Section type="skills" title="Skills" cvData={cvData} theme={currentTheme} />
          <Section type="interests" title="Interests" cvData={cvData} theme={currentTheme} />
        </div>
        <div className="md:col-span-2 space-y-8">
          <Section type="experience" title="Experience" cvData={cvData} theme={currentTheme} />
          <Section type="education" title="Education" cvData={cvData} theme={currentTheme} />
          <Section type="projects" title="Projects" cvData={cvData} theme={currentTheme} />
        </div>
      </div>
    </div>
  );
}
