import AbilitiesInterface from '../../interfaces/abilities_info.ts';

interface SectionSkillsProps {
    SkillsData: AbilitiesInterface[] | undefined;
    TitleSection: string;
}

export default function BootstrapResumeSectionSkills(props: SectionSkillsProps) {
    const { SkillsData, TitleSection } = props;

    if (!SkillsData || SkillsData.length === 0) return null;

    return (
        <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
                <h5 className="mb-0"><i className="fa fa-cogs me-2"></i>{TitleSection}</h5>
            </div>
            <div className="card-body">
                {SkillsData.map((item, index) => (
                    <div key={item.id ?? index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{item.name}</span>
                            <span className="badge bg-dark">{item.level}/10</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                            <div 
                                className="progress-bar bg-warning" 
                                role="progressbar" 
                                style={{ width: `${(item.level / 10) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
