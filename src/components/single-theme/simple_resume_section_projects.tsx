import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionProjectsProps {
    ProjectsData: ExperienceInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionProjects(props: SectionProjectsProps) {
    const {
        // EducationData,
        TitleSection,
    } = props;

    return <>
        <div className="section">
            <div className="section__title">{ TitleSection }</div>
            <div className="section__list">
                <div className="section__list-item">
                    <div className="name">DSP</div>
                    <div className="text">I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm motivated, result-focused and seeking a successful team-oriented company with opportunity to grow.</div>
                </div>
                <div className="section__list-item">
                    <div className="name">DSP</div>
                    <div className="text">I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm motivated, result-focused and seeking a successful team-oriented company with opportunity to grow. <a href="/login">link</a>
                    </div>
                </div>
            </div>
        </div>
    </>
}
