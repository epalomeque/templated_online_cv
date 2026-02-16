import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import BootstrapResumeSectionEducation from './bootstrap_resume_section_education.tsx';
import BootstrapResumeSectionExperience from './bootstrap_resume_section_experience.tsx';
import BootstrapResumeSectionInterests from './bootstrap_resume_section_interests.tsx';
import BootstrapResumeSectionProjects from './bootstrap_resume_section_projects.tsx';
import BootstrapResumeSectionSkills from './bootstrap_resume_section_skills.tsx';
import BootstrapResumeSectionLanguage from "./bootstrap_resume_section_language.tsx";
import LanguagesInterface from "../../interfaces/languages_info.ts";
import CVData from "../../classes/cv_data.ts";

export default function BootstrapResumeDetails(cv_data: SimpleResumePropsInterface) {
    const cvData: CVData = cv_data.cv_data;
    const theLanguages: LanguagesInterface[] | undefined = cvData.getLanguages();

    return (
        <div className="row g-4">
            <div className="col-12 col-md-6">
                {theLanguages && theLanguages.length > 0 && (
                    <BootstrapResumeSectionLanguage LanguageData={theLanguages} TitleSection="Languages" />
                )}
                <BootstrapResumeSectionExperience ExperienceData={cvData.getExperience()} TitleSection="Experience" />
                <BootstrapResumeSectionEducation EducationData={cvData.getEducation()} TitleSection="Education" />
            </div>
            <div className="col-12 col-md-6">
                <BootstrapResumeSectionProjects ProjectsData={cvData.getProjects()} TitleSection="Projects" />
                <BootstrapResumeSectionSkills SkillsData={cvData.getAbilities()} TitleSection="Skills" />
                <BootstrapResumeSectionInterests InterestsData={cvData.getInterests()} TitleSection="Interests" />
            </div>
        </div>
    );
}
