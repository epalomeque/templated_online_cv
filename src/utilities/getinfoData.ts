import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import SocialMediaInterface from "../interfaces/social_media_info.ts";
import CVData from "../classes/cv_data.ts";
import { JsonInput } from "./cvDataConverter.ts";


export function getHeaderDataFromJson(props: JsonInput): HeaderInfoInterface {
  const aboutData: AboutInfoInterface = {
    title: props.about?.title ?? '',
    description: props.about?.description ?? ''
  };
  const contactData: ContactInfoInterface = {
    email: props.contact_info?.email ?? [],
    phone_number: props.contact_info?.phone_number ?? [],
    address: props.contact_info?.address ?? { street_name: '', ext_number: '', city: '', state: '', country: '' },
  };
  const personalData: PersonalInfoInterface = {
    name: props.personal_info?.name ?? '',
    lastname: props.personal_info?.lastname ?? '',
    second_lastname: props.personal_info?.second_lastname ?? '',
    birthdate: props.personal_info?.birthdate ?? '',
  };
  const socialMediaData: SocialMediaInterface[] = props.social_media ?? [];

  return {
    about_info: aboutData,
    contact_info: contactData,
    personal_info: personalData,
    social_media: socialMediaData,
  }
}

export function getDetailsDataFromJson(props: JsonInput): DetailsInfoInterface {
  return {
    abilities: props.abilities ?? [],
    education: props.education ?? [],
    experience: props.experience ?? [],
    interests: props.interests ?? [],
    languages: props.languages ?? [],
    picture: props.picture ?? '',
    projects: props.projects ?? [],
  }
}

export async function getResumeInfo(url: string): Promise<JsonInput> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error on fetch request: ' + response.statusText);
  }
  return await response.json();
}

export function getCVDataFromJson(resumeCvData: JsonInput): CVData {
  return new CVData(
      getHeaderDataFromJson(resumeCvData),
      getDetailsDataFromJson(resumeCvData));
}
