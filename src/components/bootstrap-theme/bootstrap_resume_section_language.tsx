import LanguagesInterface from "../../interfaces/languages_info.ts";

interface SectionLanguageProps {
    LanguageData: LanguagesInterface[] | undefined;
    TitleSection: string;
}

export default function BootstrapResumeSectionLanguage(props: SectionLanguageProps) {
    const { LanguageData, TitleSection } = props;

    if (!LanguageData || LanguageData.length === 0) return null;

    return (
        <div className="card mb-4">
            <div className="card-header bg-danger text-white">
                <h5 className="mb-0"><i className="fa fa-language me-2"></i>{TitleSection}</h5>
            </div>
            <div className="card-body">
                <table className="table table-striped mb-0">
                    <tbody>
                        {LanguageData.map((item, index) => (
                            <tr key={item.id ?? index}>
                                <td className="fw-bold">{item.name}</td>
                                <td>{item.level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
