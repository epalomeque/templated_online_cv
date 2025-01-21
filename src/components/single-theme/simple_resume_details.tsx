export default function SimpleResumeDetails(detailsData: any) {
    console.info('detailsData ->', detailsData);

    const ExperienceItem = (item: any) => {
      console.info("ExperienceItem ->", item);


      return (
        <div className="section__list-item">
          <div className="left">
            <div className="name">{ item.job_name}</div>
            <div className="addr">San Fr, CA</div>
            <div className="duration">Jan 2011 - Feb 2015</div>
          </div>
          <div className="right">
            <div className="name">Fr developer</div>
            <div className="desc">did This and that</div>
          </div>
        </div>
      )
    }
    const ExperienceData = (experienceData: Array) => {
        const expData = experienceData.experienceData;
        if (!expData) return;

        return expData.map((item: any) => {
            return <ExperienceItem item={ item }></ExperienceItem>
        });
    }

    return (
        <>
            <div className="details">
                <div className="section">
                    <div className="section__title">Experience</div>
                    <div className="section__list">
                        <ExperienceData experienceData={ detailsData.detailsData.experience }></ExperienceData>
                    </div>
                </div>
                <div className="section">
                    <div className="section__title">Education</div>
                    <div className="section__list">
                        <div className="section__list-item">
                            <div className="left">
                                <div className="name">Sample Institute of technology</div>
                                <div className="addr">San Fr, CA</div>
                                <div className="duration">Jan 2011 - Feb 2015</div>
                            </div>
                            <div className="right">
                                <div className="name">Fr developer</div>
                                <div className="desc">did This and that</div>
                            </div>
                        </div>
                        <div className="section__list-item">
                            <div className="left">
                                <div className="name">Akount</div>
                                <div className="addr">San Monica, CA</div>
                                <div className="duration">Jan 2011 - Feb 2015</div>
                            </div>
                            <div className="right">
                                <div className="name">Fr developer</div>
                                <div className="desc">did This and that</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="section__title">Projects</div>
                    <div className="section__list">
                        <div className="section__list-item">
                            <div className="name">DSP</div>
                            <div className="text">I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm motivated, result-focused and seeking a successful team-oriented company with opportunity to grow.</div>
                        </div>
                        <div className="section__list-item">
                            <div className="name">DSP</div>
                            <div className="text">I am a front-end developer with more than 3 years of experience writing html, css, and js. I'm motivated, result-focused and seeking a successful team-oriented company with opportunity to grow. <a href="/login">link</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="section__title">Skills</div>
                    <div className="skills">
                        <div className="skills__item">
                            <div className="left"><div className="name">
                                Javascript
                            </div></div>
                            <div className="right">
                                <input  id="ck1" type="checkbox" checked/>

                                <label htmlFor="ck1"></label>
                                <input id="ck2" type="checkbox" checked/>

                                <label htmlFor="ck2"></label>
                                <input id="ck3" type="checkbox" />

                                <label htmlFor="ck3"></label>
                                <input id="ck4" type="checkbox" />
                                <label htmlFor="ck4"></label>
                                <input id="ck5" type="checkbox" />
                                <label htmlFor="ck5"></label>

                            </div>
                        </div>

                    </div>
                    <div className="skills__item">
                        <div className="left"><div className="name">
                            CSS</div></div>
                        <div className="right">
                            <input  id="ck1" type="checkbox" checked/>

                            <label htmlFor="ck1"></label>
                            <input id="ck2" type="checkbox" checked/>

                            <label htmlFor="ck2"></label>
                            <input id="ck3" type="checkbox" />

                            <label htmlFor="ck3"></label>
                            <input id="ck4" type="checkbox" />
                            <label htmlFor="ck4"></label>
                            <input id="ck5" type="checkbox" />
                            <label htmlFor="ck5"></label>

                        </div>
                    </div>

                </div>
                <div className="section">
                    <div className="section__title">
                        Interests
                    </div>
                    <div className="section__list">
                        <div className="section__list-item">
                            Football, programming.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
