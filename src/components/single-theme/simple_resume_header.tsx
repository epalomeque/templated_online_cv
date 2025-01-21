import CVData from '../../classes/cv_data';

interface SimpleResumeHeaderProps {
    cvData: CVData
}

export default function SimpleResumeHeader(props: SimpleResumeHeaderProps) {

    return (
        <>
            <div className="header">
                <div className="full-name">
                    <span className="first-name">{ props.cvData.getName() }</span>
                    <span className="last-name">{ props.cvData.getLastName() }</span>
                </div>
                <div className="contact-info">
                    <span className="email">Email: </span>
                    <span className="email-val">{ props.cvData.getFirstEmail() }</span>
                    <span className="separator"></span>
                    <span className="phone">Phone: </span>
                    <span className="phone-val">{ props.cvData.getCellPhone() }</span>
                </div>
                { props.cvData.getAboutTitle() && props.cvData.getAboutDescription() ?
                    <div className="about">
                        <span className="position">{ props.cvData.getAboutTitle() }</span>
                        <span className="desc">{ props.cvData.getAboutDescription() }</span>
                    </div>
                    : null
                }
            </div>
        </>
    );
};
