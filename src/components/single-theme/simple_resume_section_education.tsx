import EducationInterface from '../../interfaces/education_info.ts';

interface SectionEducationProps {
  EducationData: EducationInterface[] | undefined,
  TitleSection: string,
}

export default function SimpleResumeSectionEducation(props: SectionEducationProps) {
  const {
    EducationData,
    TitleSection,
  } = props;

  return <>
    <div className="section" key={ TitleSection }>
      <div className="section__title">{ TitleSection }</div>
      <div className="section__list">
        <EducationDataMap EducationData={ EducationData } />
      </div>
    </div>
  </>
}

/**
 * EducationDataMap
 **/
interface EducationDataMapProps {
  EducationData: EducationInterface[] | undefined,
}

function EducationDataMap(props:EducationDataMapProps) {
  const { EducationData } = props;

  if (!EducationData) return;

  return EducationData.map((EducationItemData: EducationInterface) => {
    return <>
      <EducationItem EducationDataItem={ EducationItemData } />
    </>
  });
}

/**
 * EducationItem
 **/
interface EducationItemProps {
  EducationDataItem: EducationInterface,
}

function EducationItem(props: EducationItemProps)  {
  const {
    EducationDataItem: {
      addr,
      duration_end,
      duration_start,
      grade_name,
      institute_name,
      pos_description,
    },
  } = props;
  return (
    <>
      <div className="section__list-item">
        <div className="left">
          <div className="name">{ institute_name }</div>
          <div className="addr">{ addr }</div>
          <div className="duration">{ duration_start } - { duration_end }</div>
        </div>
        <div className="right">
          <div className="name">{ grade_name }</div>
          <div className="desc">{ pos_description }</div>
        </div>
      </div>
    </>
  )}
