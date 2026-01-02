import ProjectsInterface from '../../interfaces/projects_info.ts';

interface SectionProjectsProps {
    ProjectsData: ProjectsInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionProjects(props: SectionProjectsProps) {
    const {
        ProjectsData,
        TitleSection,
    } = props;

    return <>
        <div className="section">
            <div className="section__title">{ TitleSection }</div>
            <div className="section__list">
              { ProjectsData && ProjectsData.map((item: ProjectsInterface) => (
                <div className="section__list-item">
                  <div className="name">{ item.name }</div>
                  <div className="text">{ item.pos_description }</div>
                </div>
                )) }
            </div>
        </div>
    </>
}
