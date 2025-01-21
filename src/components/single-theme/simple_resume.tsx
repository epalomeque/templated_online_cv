import './simple_resume.scss';
import SimpleResumeHeader from './simple_resume_header';
import CVData from '../../classes/cv_data';
import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import AboutInfoInterface from '../../interfaces/about_info.ts';
import ContactInfoInterface from '../../interfaces/contact_info.ts';
import PersonalInfoInterface from '../../interfaces/personal_info.ts';
// import SimpleResumeDetails from "./simple_resume_details";

export default function SimpleResume (cvData: any) {

  const CV_Data: CVData = new CVData(getHeaderDataFromJson(cvData));

  return (
    <>
      <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css' />
        <div className="container">
          <SimpleResumeHeader cvData={ CV_Data } />
          {/*<SimpleResumeDetails detailsData={ getDetailsData(cvData) }></SimpleResumeDetails>*/}
        </div>
    </>
  )
}

function getHeaderDataFromJson(cvData: any):HeaderInfoInterface {
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

// const getDetailsData = (...cvData: any) => {
//   return {
//     "interests": cvData.interests,
//     "experience": cvData.experience,
//     "abilities": cvData.abilities,
// "education": [],
// "interests":
// "picture": {},
// "projects": []
//   }
// };
