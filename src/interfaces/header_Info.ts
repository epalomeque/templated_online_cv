import AboutInfoInterface from './about_info.ts';
import ContactInfoInterface from './contact_info.ts';
import PersonalInfoInterface from './personal_info.ts';

export default interface HeaderInfoInterface {
  about_info: AboutInfoInterface;
  contact_info: ContactInfoInterface;
  personal_info: PersonalInfoInterface;
}
