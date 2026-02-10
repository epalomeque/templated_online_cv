import LanguagesInterface from "../../interfaces/languages_info.ts";

interface SectionLanguageProps {
    LanguageData: LanguagesInterface[] | undefined,
    TitleSection: string,
}

export default function SimpleResumeSectionLanguage(props: SectionLanguageProps): JSX.Element {
    const {
        LanguageData,
        TitleSection,
    } = props;

    return <>
        <div className="section__language" key={ TitleSection }>
            <div className="section__title">{ TitleSection }</div>
            <div className="section__list">
                <LangugageDataMap LanguageData = { LanguageData }></LangugageDataMap>
            </div>
        </div>
    </>
}

/**
 * LangugageDataMap
 **/
interface LangugageDataMapProps {
    LanguageData: LanguagesInterface[] | undefined,
}

function LangugageDataMap(props:LangugageDataMapProps) {
    const { LanguageData } = props;

    if (!LanguageData) return;

    return LanguageData.map((LanguageItemData: LanguagesInterface)  => {
        return <>
            <LanguageItem LanguageDataItem={ LanguageItemData } />
        </>
    });
}

/**
 * LanguageDataItem
 **/
interface LanguageItemProps {
    LanguageDataItem: LanguagesInterface,
}

function LanguageItem(props: LanguageItemProps)  {
    const { LanguageDataItem: {id, name, level}} = props;
    return (
        <>
            <div className="section__list-item" key={ `experience_${id}` }>
                <div className="name">{ name }</div>
                <div className="addr">{ level }</div>
            </div>
        </>
    )}
