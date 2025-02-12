import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionInterestsProps {
    InterestsData: ExperienceInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionInterests(props: SectionInterestsProps) {
    const {
        // EducationData,
        TitleSection,
    } = props;

    return <>
        <div className="section">
            <div className="section__title">
                { TitleSection }
            </div>
            <div className="section__list">
                <div className="section__list-item">
                    Football, programming.
                </div>
            </div>
        </div>
    </>
}
