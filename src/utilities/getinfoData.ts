import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';
import DetailsInfoInterface from '../interfaces/details_info.ts';
import ExperienceInterface from '../interfaces/experience_info.ts';
import EducationInterface from '../interfaces/education_info.ts';
import AbilitiesInterface from "../interfaces/abilities_info.ts";

export function getHeaderDataFromJson(cvData: any):HeaderInfoInterface {
  const aboutData:AboutInfoInterface = {
    title: cvData.cvData.about.title,
    description: cvData.cvData.about.description
  };
  const contactData:ContactInfoInterface = {
    email: cvData.cvData.contact_info.email,
    phone_number: cvData.cvData.contact_info.phone_number,
    address: cvData.cvData.contact_info.address,
  };
  const personalData:PersonalInfoInterface = {
    name: cvData.cvData.personal_info.name,
    lastname: cvData.cvData.personal_info.lastname,
    second_lastname: cvData.cvData.personal_info.second_lastname,
    birthdate: cvData.cvData.personal_info.birthdate,
  }
  return {
    about_info: aboutData,
    contact_info: contactData,
    personal_info: personalData,
  }
}

export function getDetailsDataFromJson(cvData: any): DetailsInfoInterface {
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
  const EducationData:EducationInterface[] = education
  const AbilitiesData:AbilitiesInterface[] = abilities

  return {
    abilities: AbilitiesData,
    education: EducationData,
    experience: ExperienceData,
    interests: interests,
    picture: picture,
    projects: projects,
  }
}
