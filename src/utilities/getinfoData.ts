import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import ExperienceInterface from '../interfaces/experience_info.ts';
import EducationInterface from '../interfaces/education_info.ts';
import AbilitiesInterface from '../interfaces/abilities_info.ts';


export function getHeaderDataFromJson(props:JSON|any):HeaderInfoInterface {
  const {
    cvData: {
      about,
      contact_info,
      personal_info },
  } = props;

  const aboutData:AboutInfoInterface = {
    title: about.title,
    description: about.description
  };
  const contactData:ContactInfoInterface = {
    email: contact_info.email,
    phone_number: contact_info.phone_number,
    address: contact_info.address,
  };
  const personalData:PersonalInfoInterface = {
    name: personal_info.name,
    lastname: personal_info.lastname,
    second_lastname: personal_info.second_lastname,
    birthdate: personal_info.birthdate,
  }
  return {
    about_info: aboutData,
    contact_info: contactData,
    personal_info: personalData,
  }
}

export function getDetailsDataFromJson(cvData: JSON|any): DetailsInfoInterface {
  const {
    cvData: {
      abilities,
      education,
      experience,
      interests,
      picture,
      projects,
    },
  } = cvData;

  const ExperienceData:ExperienceInterface[] = experience;
  const EducationData:EducationInterface[] = education;
  const AbilitiesData:AbilitiesInterface[] = abilities;
  const InterestData:string[] = interests;

  return {
    abilities: AbilitiesData,
    education: EducationData,
    experience: ExperienceData,
    interests: InterestData,
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