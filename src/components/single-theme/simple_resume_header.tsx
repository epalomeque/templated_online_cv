import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import SocialMediaInterface from "../../interfaces/social_media_info.ts";

export default function SimpleResumeHeader(props: SimpleResumePropsInterface) {
    const { cvData } = props;
    const socialData: SocialMediaInterface[] | undefined = cvData.getSocialMedia();
    console.log(socialData);
    return (
        <>
            <div className="header">
                <div className="full-name">
                    <span className="first-name">{ cvData.getName() }</span>
                    <span className="last-name">{ cvData.getLastName() }</span>
                </div>
                <div className="contact-info">
                    <span className="email">Email: </span>
                    <span className="email-val">{ cvData.getFirstEmail() }</span>
                    <span className="separator"></span>
                    <span className="phone">Phone: </span>
                    <span className="phone-val">{ cvData.getCellPhone() }</span>
                </div>

                { socialData && socialData.length > 0 &&
                    <div className="social-media-info">
                        {
                            socialData.map((social: SocialMediaInterface, index: number) => (
                                <a className="social-media-item" key={ index } href={ social.url } target="_blank" rel="noopener noreferrer">
                                    <span className="social-name">{ social.platform }</span>
                                </a>
                            ))
                        }
                    </div>
                }
                { cvData.getAboutTitle() && cvData.getAboutDescription() ?
                    <div className="about">
                        <span className="position">{ cvData.getAboutTitle() }</span>
                        <span className="desc">{ cvData.getAboutDescription() }</span>
                    </div>
                    : null
                }
            </div>
        </>
    );
};
