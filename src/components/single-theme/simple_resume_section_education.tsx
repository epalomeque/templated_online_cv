import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionEducationProps {
    EducationData: ExperienceInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionEducation(props: SectionEducationProps) {
    const {
        // EducationData,
        TitleSection,
    } = props;

    return <>
        <div className="section">
            <div className="section__title">{ TitleSection }</div>
            <div className="section__list">
                <div className="section__list-item">
                    <div className="left">
                        <div className="name">Sample Institute of technology</div>
                        <div className="addr">San Fr, CA</div>
                        <div className="duration">Jan 2011 - Feb 2015</div>
                    </div>
                    <div className="right">
                        <div className="name">Fr developer</div>
                        <div className="desc">did This and that</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
