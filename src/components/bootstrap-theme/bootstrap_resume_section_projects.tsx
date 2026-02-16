import ProjectsInterface from '../../interfaces/projects_info.ts';

interface SectionProjectsProps {
    ProjectsData: ProjectsInterface[] | undefined;
    TitleSection: string;
}

export default function BootstrapResumeSectionProjects(props: SectionProjectsProps) {
    const { ProjectsData, TitleSection } = props;

    if (!ProjectsData || ProjectsData.length === 0) return null;

    return (
        <div className="card mb-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0"><i className="fa fa-folder-open me-2"></i>{TitleSection}</h5>
            </div>
            <div className="card-body">
                {ProjectsData.map((item, index) => (
                    <div key={index} className="mb-3">
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-0 text-muted">{item.pos_description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
