export enum PhoneType {
  cel = 'cel',
  home = 'home',
  office = 'office',
}

export interface PhoneData {
  type: PhoneType;
  country_code: string;
  number: string;
}

interface AddressData {
  street_name: string;
  ext_number: string;
  int_number?: string;
  city: string;
  state: string;
  country: string;
}

export default interface ContactInfoInterface {
  email: string[];
  phone_number: PhoneData[];
  address: AddressData;
}
