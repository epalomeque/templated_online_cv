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
        <div className="section">
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

    return ExperienceData.map((ExperienceItemData: ExperienceInterface) => {
        return <>
          <ExperienceItem ExperienceDataItem={ ExperienceItemData }></ExperienceItem>
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
    const { ExperienceDataItem } = props;
    return (
        <>
        <div className="section__list-item">
            <div className="left">
                <div className="name">{ ExperienceDataItem.job_name }</div>
                <div className="addr">{ ExperienceDataItem.addr }</div>
                <div className="duration">{ ExperienceDataItem.duration_start } - { ExperienceDataItem.duration_end }</div>
            </div>
            <div className="right">
                <div className="name">{ ExperienceDataItem.position_name }</div>
                <div className="desc">{ ExperienceDataItem.pos_description }</div>
            </div>
        </div>
        </>
    )}
