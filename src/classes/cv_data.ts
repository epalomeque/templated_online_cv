import HeaderInfoInterface from '../interfaces/header_Info.ts';
import AboutInfoInterface from '../interfaces/about_info.ts';
import ContactInfoInterface from '../interfaces/contact_info.ts';
import PersonalInfoInterface from '../interfaces/personal_info.ts';

export default class CVData {
    about_info: AboutInfoInterface;
    contact_info: ContactInfoInterface;
    personal_info: PersonalInfoInterface;

    public constructor(header: HeaderInfoInterface) {
        this.about_info = header.about_info;
        this.contact_info = header.contact_info;
        this.personal_info = header.personal_info;
    }

    public getName(): string {
      return this.personal_info.name;
    };

    public getLastName(): string {
      return this.personal_info.lastname;
    };

    public getFullName(): string {
        return `${ this.personal_info.name } ${ this.personal_info.lastname } ${ this.personal_info.second_lastname }`;
    }

    public getEmails():string[] {
      return this.contact_info.email;
    }

    public getFirstEmail():string {
        return this.contact_info.email[0] ? this.contact_info.email[0] : '@';
    }

    public getCellPhone(): string {
        const phones = this.contact_info.phone_number;
        if (phones.length <= 0) return '---';
        const isCellType = (data:string):boolean => {
            return data === 'cel';
        }
        const cellPhones = phones.filter((phone) => isCellType(phone.type));
        if (cellPhones.length <= 0) return '---';

        const cellPhone = cellPhones[cellPhones.length - 1];
        const countryCode = cellPhone.country_code ? `+${cellPhone.country_code} ` : '';
        const celNumber = cellPhone.number ? `${cellPhone.number}` : '';

        return countryCode && celNumber ? `${ countryCode }${ celNumber }` : '---';


    }

    public getAboutTitle():string {
        return this.about_info.title ? this.about_info.title : '';
    }

    public getAboutDescription():string {
        return this.about_info.description ? this.about_info.description : '';
    }
}
