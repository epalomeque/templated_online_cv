import { describe, it, expect } from 'vitest';
import { getHeaderDataFromJson, getDetailsDataFromJson } from '../utilities/getinfoData';
import { JsonInput } from '../utilities/cvDataConverter';

describe('getinfoData Utilities', () => {
  const mockJson: JsonInput = {
    about: { title: 'Software Engineer', description: 'Experienced dev' },
    contact_info: {
      email: ['test@example.com'],
      phone_number: [{ type: 'mobile', number: '123456789' }],
      address: { street_name: 'Main St', ext_number: '123', city: 'Madrid', state: 'Madrid', country: 'Spain' }
    },
    personal_info: { name: 'John', lastname: 'Doe', second_lastname: 'Smith', birthdate: '1990-01-01' },
    social_media: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }],
    abilities: [{ id: 1, name: 'React', level: 9 }],
    education: [{ institute_name: 'Uni', addr: 'City', duration_start: '2010', duration_end: '2014', grade_name: 'CS', pos_description: 'Study' }],
    experience: [{ id: 1, addr: 'Company', duration_start: '2015', duration_end: 'Present', job_name: 'Dev', position_name: 'Senior', pos_description: 'Coding' }],
    interests: ['Music'],
    languages: [{ id: 1, name: 'English', level: 'Native' }],
    picture: 'path/to/pic',
    projects: [{ id: 1, name: 'Project 1', pos_description: 'My project' }]
  };

  it('getHeaderDataFromJson should correctly map JSON to HeaderInfoInterface', () => {
    const result = getHeaderDataFromJson(mockJson);
    expect(result.about_info.title).toBe('Software Engineer');
    expect(result.contact_info.email).toContain('test@example.com');
    expect(result.personal_info.name).toBe('John');
    expect(result.social_media?.[0].platform).toBe('LinkedIn');
  });

  it('getDetailsDataFromJson should correctly map JSON to DetailsInfoInterface', () => {
    const result = getDetailsDataFromJson(mockJson);
    expect(result.abilities).toHaveLength(1);
    expect(result.abilities[0].name).toBe('React');
    expect(result.experience).toHaveLength(1);
    expect(result.projects).toHaveLength(1);
    expect(result.interests).toContain('Music');
    expect(result.picture).toBe('path/to/pic');
  });

  it('should handle missing optional fields with default values', () => {
    const emptyJson: JsonInput = {};
    const result = getHeaderDataFromJson(emptyJson);
    expect(result.about_info.title).toBe('');
    expect(result.contact_info.email).toEqual([]);
    expect(result.social_media).toEqual([]);
  });
});
