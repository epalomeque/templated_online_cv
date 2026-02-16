import ExperienceInterface from "../../interfaces/experience_info.ts";

interface SectionExperienceProps {
    ExperienceData: ExperienceInterface[] | undefined;
    TitleSection: string;
}

export default function BootstrapResumeSectionExperience(props: SectionExperienceProps) {
    const { ExperienceData, TitleSection } = props;

    if (!ExperienceData || ExperienceData.length === 0) return null;

    return (
        <div className="card mb-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="fa fa-briefcase me-2"></i>{TitleSection}</h5>
            </div>
            <div className="card-body">
                <div className="timeline">
                    {ExperienceData.map((item, index) => (
                        <div key={item.id ?? index} className="mb-3">
                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                                <div>
                                    <h6 className="mb-1">{item.job_name}</h6>
                                    <p className="mb-1 text-muted">{item.position_name}</p>
                                </div>
                                <span className="badge bg-secondary">
                                    {item.duration_start} - {item.duration_end}
                                </span>
                            </div>
                            <small className="text-muted">
                                <i className="fa fa-map-marker me-1"></i>{item.addr}
                            </small>
                            {item.pos_description && (
                                <p className="mt-2 mb-0">{item.pos_description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
