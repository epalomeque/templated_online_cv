import AbilitiesInterface from '../interfaces/abilities_info';
import AboutInfoInterface from '../interfaces/about_info';
import ContactInfoInterface from '../interfaces/contact_info';
import DetailsInfoInterface from '../interfaces/details_info';
import EducationInterface from "../interfaces/education_info";
import ExperienceInterface from '../interfaces/experience_info';
import HeaderInfoInterface from '../interfaces/header_Info';
import LanguagesInterface from '../interfaces/languages_info';
import PersonalInfoInterface from '../interfaces/personal_info';
import ProjectsInterface from '../interfaces/projects_info';
import SocialMediaInterface from "../interfaces/social_media_info";

export type Theme = 'simple' | 'bootstrap' | 'dark-theme';

export interface CVState {
  header: HeaderInfoInterface;
  details: DetailsInfoInterface;
  isLoading: boolean;
  error: string | null;
  theme: Theme;
}

export interface CVFullData {
  abilities?: AbilitiesInterface[];
  about_info: AboutInfoInterface;
  contact_info: ContactInfoInterface;
  education?: EducationInterface[];
  experience?: ExperienceInterface[];
  interests?: string[];
  languages?: LanguagesInterface[];
  personal_info: PersonalInfoInterface;
  picture?: string;
  projects?: ProjectsInterface[];
  social_media?: SocialMediaInterface[];
}

export const createCVState = (
  header: HeaderInfoInterface,
  details: DetailsInfoInterface,
  theme: Theme = 'simple'
): CVState => ({
  header,
  details,
  isLoading: false,
  error: null,
  theme,
});
