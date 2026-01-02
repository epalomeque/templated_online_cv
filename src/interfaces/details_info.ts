import AbilitiesInterface from './abilities_info.ts';
import EducationInterface from './education_info.ts';
import ExperienceInterface from './experience_info.ts';
import ProjectsInterface from './projects_info.ts';

export default interface DetailsInfoInterface {
    abilities?: AbilitiesInterface[];
    education?: EducationInterface[];
    experience?: ExperienceInterface[];
    interests?: string[];
    picture?: string;
    projects?: ProjectsInterface[]
}
