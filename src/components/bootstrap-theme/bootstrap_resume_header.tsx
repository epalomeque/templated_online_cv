import CVData from "../../classes/cv_data.ts";
import SimpleResumePropsInterface from '../../interfaces/simpleResumeProps.ts';
import SocialMediaInterface from "../../interfaces/social_media_info.ts";

export default function BootstrapResumeHeader(cv_data: SimpleResumePropsInterface) {
    const cvData: CVData = cv_data.cv_data;
    const socialData: SocialMediaInterface[] | undefined = cvData.getSocialMedia();

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="row">
                    <div className="col-12">
                        <h1 className="display-4 mb-0">
                            {cvData.getName()} {cvData.getLastName()}
                        </h1>
                    </div>
                </div>
                
                {cvData.getAboutTitle() && cvData.getAboutDescription() && (
                    <div className="row mt-3">
                        <div className="col-12">
                            <h4 className="text-muted">{cvData.getAboutTitle()}</h4>
                            <p className="lead">{cvData.getAboutDescription()}</p>
                        </div>
                    </div>
                )}

                <div className="row mt-3">
                    <div className="col-12 col-md-6 mb-2 mb-md-0">
                        <i className="fa fa-envelope me-2"></i>
                        <strong>Email:</strong> {cvData.getFirstEmail()}
                    </div>
                    <div className="col-12 col-md-6">
                        <i className="fa fa-phone me-2"></i>
                        <strong>Phone:</strong> {cvData.getCellPhone()}
                    </div>
                </div>

                {socialData && socialData.length > 0 && (
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="d-flex flex-wrap gap-2">
                                {socialData.map((social: SocialMediaInterface, index: number) => (
                                    <a 
                                        key={index}
                                        href={social.url} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        <i className="fa fa-link me-1"></i>
                                        {social.platform}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
