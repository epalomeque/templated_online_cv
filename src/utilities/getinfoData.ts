import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import ExperienceInterface from '../interfaces/experience_info.ts';
import EducationInterface from '../interfaces/education_info.ts';
import AbilitiesInterface from '../interfaces/abilities_info.ts';

interface getHeaderDataProps {
  cvData: any | JSON | unknown,
}

export function getHeaderDataFromJson(props: getHeaderDataProps):HeaderInfoInterface {
  const { cvData } = props;

  const aboutData:AboutInfoInterface = {
    title: cvData.about.title,
    description: cvData.about.description
  };
  const contactData:ContactInfoInterface = {
    email: cvData.contact_info.email,
    phone_number: cvData.contact_info.phone_number,
    address: cvData.contact_info.address,
  };
  const personalData:PersonalInfoInterface = {
    name: cvData.personal_info.name,
    lastname: cvData.personal_info.lastname,
    second_lastname: cvData.personal_info.second_lastname,
    birthdate: cvData.personal_info.birthdate,
  }
  return {
    about_info: aboutData,
    contact_info: contactData,
    personal_info: personalData,
  }
}

export function getDetailsDataFromJson(cvData: any | JSON): DetailsInfoInterface {
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