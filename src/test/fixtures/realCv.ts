import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import HeaderInfoInterface from '../../interfaces/header_Info.ts';
import DetailsInfoInterface from '../../interfaces/details_info.ts';
import { JsonInput } from '../../utilities/cvDataConverter';
import {
  getDetailsDataFromJson,
  getHeaderDataFromJson,
} from '../../utilities/getinfoData';

/** Where the CV data loaded by {@link loadRealCv} came from. */
export type CvSource = 'cvdata.json' | 'fallback';

/** Result of {@link loadRealCv}. */
export interface LoadedCv {
  readonly header: HeaderInfoInterface;
  readonly details: DetailsInfoInterface;
  /** `cvdata.json` when the file exists, `fallback` when it does not. */
  readonly source: CvSource;
}

/**
 * CV used when `public/cvdata.json` is absent.
 *
 * The real file is gitignored on purpose, so it does not exist in a fresh
 * clone. Without this fallback four test files would fail with `ENOENT` for
 * anybody but the author. The shape mirrors the real CV: two contact emails,
 * `• ` bullets in every experience entry, a mixed English and Spanish register,
 * figures, and a URL sitting in `projects[1].name` where the catalog must never
 * send it.
 */
const FALLBACK_CV: JsonInput = {
  about: {
    title: 'Software Engineer',
    description:
      'I am a Software Engineer with +15 years of experience specializing in building robust and scalable applications. I have extensive expertise in FastAPI for high-performance backend development and React and Angular for creating dynamic, user-friendly frontend interfaces. Throughout my career, I have also led development teams, ensuring efficient collaboration and delivery of high-quality software. My work focuses on delivering efficient, maintainable code while optimizing performance and ensuring smooth integration with databases and external services.',
  },
  personal_info: {
    name: 'Test',
    lastname: 'Candidate',
    second_lastname: 'Example',
    birthdate: '1979-12-24',
  },
  contact_info: {
    email: ['user@gmail.com', 'user@hotmail.com'],
    phone_number: [{ type: 'cel', country_code: '00', number: '1234567890' }],
    address: {
      street_name: 'Test Street',
      ext_number: '1',
      int_number: '2',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    },
  },
  social_media: [
    { id: 0, platform: 'LinkedIn', url: 'https://linkedin.com/in/test/' },
    { id: 1, platform: 'GitHub', url: 'https://github.com/test/' },
  ],
  languages: [
    { id: 0, name: 'Spanish', level: 'Native' },
    { id: 1, name: 'English', level: 'C1 - Avanzado' },
  ],
  education: [
    {
      id: 0,
      institute_name: 'Universidad de Ejemplo',
      addr: 'Test City, Test State',
      duration_start: '2001-09-01',
      duration_end: '2006-12-01',
      grade_name: 'Bachelors Degree, Unfinished',
      pos_description: 'Ingeniería en Sistemas Computacionales de Prueba',
    },
  ],
  experience: [
    {
      id: 0,
      job_name: 'Test Seekers',
      addr: 'Test City, Test State',
      duration_start: '2022-03-01',
      duration_end: '2025-01-01',
      position_name: 'UI Developer / Technical Leader',
      pos_description:
        "• Development of new functionality components for Grupo Aeroméxico's web platform, focusing on the Check-in and Booking flows.\n• Research and resolution of production bugs aimed at reducing the application's error rate.\n• Team coordination and creation of technical solutions for developments in the integration and consolidation phases of the 'Software Factories' model within the Grupo Aeroméxico development department.\n• Conducting a comprehensive analysis to plan and integrate microservices, while defining key performance indicators (KPIs) for the TravelHub platform's minimum viable product (MVP)",
    },
    {
      id: 1,
      job_name: 'Mandarin Projects',
      addr: 'Test City, Test State',
      duration_start: '2019-09-01',
      duration_end: '2021-10-01',
      position_name: 'Solutions Developer',
      pos_description:
        '• Development of customized projects using Python and React as the core technologies, analyzing data and integrating information sources into PostgreSQL databases.\n• Involved in planning, deployment, and fine-tuning of developments in private datacenters using Ubuntu Linux servers',
    },
    {
      id: 2,
      job_name: 'Secretaría de la Función Pública de Prueba',
      addr: 'Test City, Test State',
      duration_start: '2019-01-01',
      duration_end: '2019-10-01',
      position_name: 'Lead Developer',
      pos_description:
        '• Desarrollo de software y creación de mejoras para entidades ya implementadas.\n• Planificación, despliegue y afinamiento de desarrollos en datacenters privados usando servidores Linux.',
    },
  ],
  abilities: [
    { id: 0, name: 'Python (Django, FastAPI, Flask)', level: 9 },
    { id: 1, name: 'SQL', level: 7 },
    { id: 2, name: 'Javascript (React, TypeScript)', level: 8 },
    { id: 3, name: 'Linux / OS X / Windows', level: 8 },
  ],
  interests: ['Read', 'Travels', 'Music', 'AI Technologies', 'Videogames'],
  picture: {},
  projects: [
    {
      id: 0,
      name: 'test-project.example',
      pos_description:
        'Web site created in Wordpress, with custom themes and plugins development, to share my projects and knowledge in programming and technology. It also serves as a portfolio for my work and a platform to share articles and tutorials related to software development.',
    },
    {
      id: 1,
      name: 'https://templatedcv.esmasweb.net/',
      pos_description:
        'SPA web application, created in React, to display the information of my CV in a dynamic and interactive way. It consumes the data from a JSON file, which allows for easy updates and maintenance.',
    },
  ],
} as unknown as JsonInput;

/** Path of the real CV data shipped with the app. */
const REAL_CV_PATH = resolve(process.cwd(), 'public/cvdata.json');

/**
 * Loads the CV the tests work against.
 *
 * The real `public/cvdata.json` is preferred because it is the case that
 * matters: a CV that mixes English and Spanish, uses `• ` bullets, carries
 * figures and holds two contact emails, which exercises both branches of the
 * provider resolver. That file is gitignored, so when it is missing the tests
 * fall back to {@link FALLBACK_CV} and keep working in a fresh clone.
 *
 * @returns The header and details of the CV, plus which source was used.
 */
export function loadRealCv(): LoadedCv {
  if (!existsSync(REAL_CV_PATH)) {
    return {
      header: getHeaderDataFromJson(FALLBACK_CV),
      details: getDetailsDataFromJson(FALLBACK_CV),
      source: 'fallback',
    };
  }

  const raw = readFileSync(REAL_CV_PATH, 'utf-8');
  const input = JSON.parse(raw) as JsonInput;
  return {
    header: getHeaderDataFromJson(input),
    details: getDetailsDataFromJson(input),
    source: 'cvdata.json',
  };
}

/** Counts the `•` markers of a text. */
export function countBullets(text: string): number {
  return text.split('•').length - 1;
}

/**
 * Swaps wording for a synonym without touching a single fact.
 *
 * Used by the `claimsGuard` tests to produce a conservative rewrite of an
 * arbitrary field. Every pattern deliberately keeps the length of the original
 * close and introduces no new noun, number or named entity.
 */
const CONSERVATIVE_SWAPS: readonly (readonly [RegExp, string])[] = [
  [/\bDevelopment of\b/g, 'Built'],
  [/\bResearch and resolution of\b/g, 'Investigation and fixing'],
  [/\bTeam coordination and creation of\b/g, 'Team coordination and building of'],
  [/\bConducting a\b/g, 'Running a'],
  [/\bCustomized projects\b/g, 'Bespoke projects'],
  [/\bDesarrollo de\b/g, 'Construcción de'],
  [/\bPlanificación, despliegue y\b/g, 'Planificación, despliegue y'],
  [/\bI am a\b/g, 'I am a'],
  [/\bI have\b/g, 'I hold'],
  [/\bI am committed to\b/g, 'I am devoted to'],
  [/\bI am looking for\b/g, 'I am seeking'],
];

/**
 * Produces a conservative rewrite of a text.
 *
 * @param text Original text.
 * @returns The text with its wording swapped where a pattern applies.
 */
export function conservativeRewrite(text: string): string {
  return CONSERVATIVE_SWAPS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    text,
  );
}