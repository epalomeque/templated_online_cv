import HeaderInfoInterface from '../interfaces/header_Info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import SocialMediaInterface from '../interfaces/social_media_info.ts';
import AbilitiesInterface from '../interfaces/abilities_info.ts';
import EducationInterface from '../interfaces/education_info.ts';
import ExperienceInterface from '../interfaces/experience_info.ts';
import LanguagesInterface from '../interfaces/languages_info.ts';
import ProjectsInterface from '../interfaces/projects_info.ts';
import { PhoneData } from '../interfaces/contact_info.ts';

type AddressData = ContactInfoInterface['address'];

/**
 * Converts the application state (header and details) to a JSON format 
 * suitable for export or storage.
 * 
 * @param header - The header information from state.
 * @param details - The details information from state.
 * @returns An object in the expected JSON schema.
 */
export function stateToJsonFormat(
  header: HeaderInfoInterface, 
  details: DetailsInfoInterface
): Record<string, unknown> {
  return {
    about: {
      title: header.about_info.title,
      description: header.about_info.description
    },
    contact_info: header.contact_info,
    personal_info: header.personal_info,
    social_media: header.social_media,
    abilities: details.abilities,
    education: details.education,
    experience: details.experience,
    interests: details.interests,
    languages: details.languages,
    picture: details.picture,
    projects: details.projects,
  };
}

/**
 * Interface representing the structure of the input JSON data.
 */
export interface JsonInput {
  about?: { title?: string; description?: string };
  contact_info?: { email?: string[]; phone_number?: PhoneData[]; address?: AddressData };
  personal_info?: { name?: string; lastname?: string; second_lastname?: string; birthdate?: string };
  social_media?: SocialMediaInterface[];
  abilities?: AbilitiesInterface[];
  education?: EducationInterface[];
  experience?: ExperienceInterface[];
  interests?: string[];
  languages?: LanguagesInterface[];
  picture?: string;
  projects?: ProjectsInterface[];
}

/**
 * Converts raw JSON input into the internal application state format.
 * 
 * @param json - The raw JSON data.
 * @returns An object containing header and details formatted for the Redux store.
 */
export function jsonToStateFormat(json: JsonInput): { header: HeaderInfoInterface; details: DetailsInfoInterface } {
  const defaultAddress: AddressData = { 
    street_name: '', ext_number: '', city: '', state: '', country: '' 
  };

  const header: HeaderInfoInterface = {
    about_info: {
      title: json.about?.title ?? '',
      description: json.about?.description ?? ''
    },
    contact_info: {
      email: json.contact_info?.email ?? [],
      phone_number: json.contact_info?.phone_number ?? [],
      address: json.contact_info?.address ?? defaultAddress
    },
    personal_info: {
      name: json.personal_info?.name ?? '',
      lastname: json.personal_info?.lastname ?? '',
      second_lastname: json.personal_info?.second_lastname ?? '',
      birthdate: json.personal_info?.birthdate ?? ''
    },
    social_media: json.social_media ?? []
  };

  const details: DetailsInfoInterface = {
    abilities: json.abilities ?? [],
    education: json.education ?? [],
    experience: json.experience ?? [],
    interests: json.interests ?? [],
    languages: json.languages ?? [],
    picture: json.picture ?? '',
    projects: json.projects ?? []
  };

  return { header, details };
}
