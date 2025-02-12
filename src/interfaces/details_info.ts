import ExperienceInterface from './experience_info.ts';
import EducationInterface from './education_info.ts';

export default interface DetailsInfoInterface {
    education?: EducationInterface[];
    experience?: ExperienceInterface[];
    abilities?: string[];
    interests?: string[];
    picture?: string;
    projects?: string[]
}
