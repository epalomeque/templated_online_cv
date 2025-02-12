import ExperienceInterface from './experience_info.ts';

export default interface DetailsInfoInterface {
    education?: string[];
    experience?: ExperienceInterface[];
    abilities?: string[];
    interests?: string[];
    picture?: string;
    projects?: string[]
}
