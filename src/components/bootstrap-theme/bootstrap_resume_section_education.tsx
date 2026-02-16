import EducationInterface from '../../interfaces/education_info.ts';

interface SectionEducationProps {
  EducationData: EducationInterface[] | undefined;
  TitleSection: string;
}

export default function BootstrapResumeSectionEducation(props: SectionEducationProps) {
  const { EducationData, TitleSection } = props;

  if (!EducationData || EducationData.length === 0) return null;

  return (
    <div className="card mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0"><i className="fa fa-graduation-cap me-2"></i>{TitleSection}</h5>
      </div>
      <div className="card-body">
        {EducationData.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <h6 className="mb-1">{item.institute_name}</h6>
                <p className="mb-1 text-muted">{item.grade_name}</p>
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
  );
}
