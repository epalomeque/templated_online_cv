interface SectionInterestsProps {
    InterestsData: string[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionInterests(props: SectionInterestsProps) {
  const {
    InterestsData,
    TitleSection,
  } = props;

  return <>
    <div className="section">
      <div className="section__title">{ TitleSection }</div>
      <div className="section__list">
        <div className="section__list-item">
          { InterestsData && InterestsData.map((item: string, index:number ) => (
            <span key={ index }>{ item } - </span>
          )) }
        </div>
      </div>
    </div>
    </>
}
