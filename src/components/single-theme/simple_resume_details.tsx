import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import SimpleResumeSectionExperience from './simple_resume_section_experience.tsx';
import SimpleResumeSectionEducation from './simple_resume_section_education.tsx';
import SimpleResumeSectionProjects from './simple_resume_section_projects.tsx';
import SimpleResumeSectionSkills from './simple_resume_section_skills.tsx';
import SimpleResumeSectionInterests from './simple_resume_section_interests.tsx';

export default function SimpleResumeDetails(props: SimpleResumePropsInterface) {
    const {
      cvData
    } = props;

    return (
      <>
        <div className="details">
          <SimpleResumeSectionExperience ExperienceData = { cvData.getExperience() } TitleSection={ 'Experience' } />
          <SimpleResumeSectionEducation EducationData={ undefined } TitleSection={'Education'} />
          <SimpleResumeSectionProjects ProjectsData={ undefined } TitleSection={'Projects'} />
          <SimpleResumeSectionSkills SkillsData={ undefined } TitleSection={'Skills'} />
          <SimpleResumeSectionInterests InterestsData={ undefined } TitleSection={ 'Interests' } />
        </div>
      </>
    );
}
