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
        <div className="section section__experience" key={ TitleSection }>
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

    return ExperienceData.map((ExperienceItemData: ExperienceInterface, index: number)  => {
        return <ExperienceItem key={index} ExperienceDataItem={ ExperienceItemData } />
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
      job_name,
      pos_description,
      position_name,
    },
  } = props;
  return (
      <div className="section__list-item">
        <div className="left">
          <div>
          <div className="name">Company: { job_name }</div>
          <div className="name">Position: { position_name }</div>
          </div>
          <div>
          <div className="addr">Place: { addr }</div>
          <div className="duration">Duration: { duration_start } - { duration_end }</div>
          </div>
        </div>
        <div className="right">
          <div className="name">Position: { position_name }</div>
          <div className="desc">{ pos_description }</div>
        </div>
      </div>
  )
}
