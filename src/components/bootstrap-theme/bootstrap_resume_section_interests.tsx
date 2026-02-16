interface SectionInterestsProps {
    InterestsData: string[] | undefined;
    TitleSection: string;
}

export default function BootstrapResumeSectionInterests(props: SectionInterestsProps) {
    const { InterestsData, TitleSection } = props;

    if (!InterestsData || InterestsData.length === 0) return null;

    return (
        <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
                <h5 className="mb-0"><i className="fa fa-heart me-2"></i>{TitleSection}</h5>
            </div>
            <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                    {InterestsData.map((item, index) => (
                        <span key={index} className="badge bg-light text-dark">{item}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
