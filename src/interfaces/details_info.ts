import AbilitiesInterface from './abilities_info.ts';
import EducationInterface from './education_info.ts';
import ExperienceInterface from './experience_info.ts';

export default interface DetailsInfoInterface {
    education?: EducationInterface[];
    experience?: ExperienceInterface[];
    abilities?: AbilitiesInterface[];
    interests?: string[];
    picture?: string;
    projects?: string[]
}
