import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import ExperienceInterface from '../interfaces/experience_info.ts';
import EducationInterface from '../interfaces/education_info.ts';
import AbilitiesInterface from '../interfaces/abilities_info.ts';
import LanguagesInterface from "../interfaces/languages_info.ts";
import SocialMediaInterface from "../interfaces/social_media_info.ts";
import CVData from "../classes/cv_data.ts";


export function getHeaderDataFromJson(props:JSON|any): HeaderInfoInterface {
  const {
      about,
      contact_info,
      personal_info,
      social_media,
  } = props;

  const aboutData: AboutInfoInterface = {
    title: about.title,
    description: about.description
  };
  const contactData: ContactInfoInterface = {
    email: contact_info.email,
    phone_number: contact_info.phone_number,
    address: contact_info.address,
  };
  const personalData: PersonalInfoInterface = {
    name: personal_info.name,
    lastname: personal_info.lastname,
    second_lastname: personal_info.second_lastname,
    birthdate: personal_info.birthdate,
  };
  const socialMediaData: SocialMediaInterface[] = social_media;

  return {
    about_info: aboutData,
    contact_info: contactData,
    personal_info: personalData,
    social_media: socialMediaData,
  }
}

export function getDetailsDataFromJson(props: JSON|any): DetailsInfoInterface {
  const {
      abilities,
      education,
      experience,
      interests,
      languages,
      picture,
      projects,
  } = props;

  const ExperienceData: ExperienceInterface[] = experience;
  const EducationData: EducationInterface[] = education;
  const AbilitiesData: AbilitiesInterface[] = abilities;
  const InterestData: string[] = interests;
  const languagesData: LanguagesInterface[] = languages;

  return {
    abilities: AbilitiesData,
    education: EducationData,
    experience: ExperienceData,
    interests: InterestData,
    languages: languagesData,
    picture: picture,
    projects: projects,
  }
}

export async function getResumeInfo(url:string):Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error on fetch request: ' + response.statusText);
  }
  return await response.json();
}

export function getCVDataFromJson(resumeCvData: JSON|any): CVData {
  return new CVData(
      getHeaderDataFromJson(resumeCvData),
      getDetailsDataFromJson(resumeCvData));
}
