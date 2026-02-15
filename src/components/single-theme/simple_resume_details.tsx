import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import SimpleResumeSectionEducation from './simple_resume_section_education.tsx';
import SimpleResumeSectionExperience from './simple_resume_section_experience.tsx';
import SimpleResumeSectionInterests from './simple_resume_section_interests.tsx';
import SimpleResumeSectionProjects from './simple_resume_section_projects.tsx';
import SimpleResumeSectionSkills from './simple_resume_section_skills.tsx';
import SimpleResumeSectionLanguage from "./simple_resume_section_language.tsx";
import LanguagesInterface from "../../interfaces/languages_info.ts";
import CVData from "../../classes/cv_data.ts";


export default function SimpleResumeDetails(cv_data: SimpleResumePropsInterface) {
    const cvData:CVData = cv_data.cv_data
    const theLanguages: LanguagesInterface[] | undefined = cvData.getLanguages();

    return (
      <>
        <div className="details">
          {
            theLanguages && theLanguages.length > 0 &&
            <SimpleResumeSectionLanguage LanguageData={theLanguages} TitleSection={ 'Languages' } />
          }
          <SimpleResumeSectionExperience ExperienceData = { cvData.getExperience() } TitleSection={ 'Experience' } />
          <SimpleResumeSectionEducation EducationData={ cvData.getEducation() } TitleSection={'Education'} />
          <SimpleResumeSectionProjects ProjectsData={ cvData.getProjects() } TitleSection={'Projects'} />
          <SimpleResumeSectionSkills SkillsData={ cvData.getAbilities() } TitleSection={'Skills'} />
          <SimpleResumeSectionInterests InterestsData={ cvData.getInterests() } TitleSection={ 'Interests' } />
        </div>
      </>
    );
}
