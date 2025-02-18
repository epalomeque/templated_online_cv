import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import SimpleResumeSectionEducation from './simple_resume_section_education.tsx';
import SimpleResumeSectionExperience from './simple_resume_section_experience.tsx';
import SimpleResumeSectionInterests from './simple_resume_section_interests.tsx';
import SimpleResumeSectionProjects from './simple_resume_section_projects.tsx';
import SimpleResumeSectionSkills from './simple_resume_section_skills.tsx';

export default function SimpleResumeDetails(props: SimpleResumePropsInterface) {
    const {
      cvData
    } = props;

    console.info('cvData', cvData);
    return (
      <>
        <div className="details">
          <SimpleResumeSectionExperience ExperienceData = { cvData.getExperience() } TitleSection={ 'Experience' } />
          <SimpleResumeSectionEducation EducationData={ cvData.getEducation() } TitleSection={'Education'} />
          <SimpleResumeSectionProjects ProjectsData={ undefined } TitleSection={'Projects'} />
          <SimpleResumeSectionSkills SkillsData={ cvData.getAbilities() } TitleSection={'Skills'} />
          <SimpleResumeSectionInterests InterestsData={ cvData.getInterests() } TitleSection={ 'Interests' } />
        </div>
      </>
    );
}
