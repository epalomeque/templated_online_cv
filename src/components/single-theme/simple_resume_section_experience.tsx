import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionExperienceProps {
    ExperienceData: ExperienceInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionExperience(props: SectionExperienceProps) {
    const {
        ExperienceData,
        TitleSection,
    } = props;

    return <>
        <div className="section" key={ TitleSection }>
            <div className="section__title">{ TitleSection }</div>
            <div className="section__list">
                <ExperienceDataMap ExperienceData = { ExperienceData }></ExperienceDataMap>
            </div>
        </div>
    </>
}

/**
 * ExperienceDataMap
 **/
interface ExperienceDataMapProps {
    ExperienceData: ExperienceInterface[] | undefined,
}

function ExperienceDataMap(props:ExperienceDataMapProps) {
    const { ExperienceData } = props;

    if (!ExperienceData) return;

    return ExperienceData.map((ExperienceItemData: ExperienceInterface)  => {
        return <>
          <ExperienceItem ExperienceDataItem={ ExperienceItemData } />
        </>
    });
}

/**
 * ExperienceDataItem
 **/
interface ExperienceItemProps {
    ExperienceDataItem: ExperienceInterface,
}

function ExperienceItem(props: ExperienceItemProps)  {
  const {
    ExperienceDataItem: {
      addr,
      duration_end,
      duration_start,
      id,
      job_name,
      pos_description,
      position_name,
    },
  } = props;
  return (
    <>
      <div className="section__list-item" key={ `experience_${id}` }>
        <div className="left">
          <div className="name">{ job_name }</div>
          <div className="addr">{ addr }</div>
          <div className="duration">{ duration_start } - { duration_end }</div>
        </div>
        <div className="right">
          <div className="name">{ position_name }</div>
          <div className="desc">{ pos_description }</div>
        </div>
      </div>
    </>
  )}
