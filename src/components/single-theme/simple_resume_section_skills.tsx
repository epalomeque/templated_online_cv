import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionSkillsProps {
    SkillsData: ExperienceInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionSkills(props: SectionSkillsProps) {
    const {
        // EducationData,
        TitleSection,
    } = props;

    return <>
        <div className="section">
            <div className="section__title">{ TitleSection }</div>
            <div className="skills">
                <div className="skills__item">
                    <div className="left"><div className="name">
                        Javascript
                    </div></div>
                    <div className="right">
                        <input  id="ck1" type="checkbox" checked/>

                        <label htmlFor="ck1"></label>
                        <input id="ck2" type="checkbox" checked/>

                        <label htmlFor="ck2"></label>
                        <input id="ck3" type="checkbox" />

                        <label htmlFor="ck3"></label>
                        <input id="ck4" type="checkbox" />
                        <label htmlFor="ck4"></label>
                        <input id="ck5" type="checkbox" />
                        <label htmlFor="ck5"></label>

                    </div>
                </div>
            </div>
            <div className="skills__item">
                <div className="left"><div className="name">
                    CSS</div></div>
                <div className="right">
                    <input  id="ck1" type="checkbox" checked/>

                    <label htmlFor="ck1"></label>
                    <input id="ck2" type="checkbox" checked/>

                    <label htmlFor="ck2"></label>
                    <input id="ck3" type="checkbox" />

                    <label htmlFor="ck3"></label>
                    <input id="ck4" type="checkbox" />
                    <label htmlFor="ck4"></label>
                    <input id="ck5" type="checkbox" />
                    <label htmlFor="ck5"></label>

                </div>
            </div>

        </div>
    </>
}
