import AbilitiesInterface from './abilities_info.ts';
import EducationInterface from './education_info.ts';
import ExperienceInterface from './experience_info.ts';
import LanguagesInterface from "./languages_info.ts";
import ProjectsInterface from './projects_info.ts';
import SocialMediaInterface from "./social_media_info.ts";

export default interface DetailsInfoInterface {
    abilities?: AbilitiesInterface[];
    education?: EducationInterface[];
    experience?: ExperienceInterface[];
    interests?: string[];
    languages?: LanguagesInterface[];
    picture?: string;
    projects?: ProjectsInterface[];
    social_media?: SocialMediaInterface[];
}
