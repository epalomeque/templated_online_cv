export const singleThemeTemplates = {
  layout: `
    <div class="container">
      {{{header}}}
      <div class="details">
        {{{language}}}
        {{{experience}}}
        {{{education}}}
        {{{projects}}}
        {{{skills}}}
        {{{interests}}}
      </div>
    </div>
  `,
  styles: `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #eee; font-family: 'Lato', sans-serif; font-weight: 400; color: #222; font-size: 14px; line-height: 26px; padding: 20px 0 50px 0; }
    .container { max-width: 700px; background: #fff; margin: 0 auto; box-shadow: 1px 1px 2px #DAD7D7; border-radius: 3px; padding: 40px; margin-top: 20px; }
    .header { margin-bottom: 30px; }
    .header .full-name { font-size: 40px; text-transform: uppercase; margin-bottom: 15px; }
    .header .first-name { font-weight: 700; }
    .header .last-name { font-weight: 300; }
    .header .contact-info { margin-bottom: 5px; }
    .header .social-media-info { display: flex; justify-content: space-around; margin-bottom: 15px; }
    .header .email, .header .phone { color: #999; font-weight: 300; }
    .header .separator { height: 10px; display: inline-block; border-left: 2px solid #999; margin: 0 10px; }
    .header .position { font-weight: bold; display: inline-block; margin-right: 10px; text-decoration: underline; }
    .details { line-height: 20px; }
    .details .section, .details .section__language { margin-bottom: 40px; }
    .details .section:last-of-type { margin-bottom: 0; }
    .details .section__title { letter-spacing: 2px; color: #54AFE4; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
    .details .section__language .section__list { display: flex; justify-content: space-evenly; flex-direction: row; }
    .details .section__list-item { margin-bottom: 40px; }
    .details .left, .details .right { vertical-align: top; display: inline-block; }
    .details .left { width: 60%; }
    .details .right { text-align: right; width: 39%; }
    .details div.section.section__experience>.section__list>.section__list-item { display: flex; flex-direction: column; }
    .details div.section.section__experience>.section__list>.section__list-item .left, 
    .details div.section.section__experience>.section__list>.section__list-item .right { width: 100%; display: flex; flex-direction: row; }
    .details div.section.section__experience>.section__list>.section__list-item .left { justify-content: space-around; }
    .details div.section.section__experience>.section__list>.section__list-item .right { flex-direction: column; text-align: justify; }
    .details .name { font-weight: bold; }
    .details a { text-decoration: none; color: #000; font-style: italic; }
    .details .skills__item { margin-bottom: 10px; }
    .details .skills__item .right input { display: none; }
    .details .skills__item .right label { display: inline-block; width: 15px; height: 15px; background: #C3DEF3; border-radius: 20px; margin-right: 3px; }
    .details .skills__item .right input:checked + label { background: #79A9CE; }
  `,
  externalCss: [
    'https://fonts.googleapis.com/css?family=Lato:400,300,700',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
  ],
  header: `{{#if hasAbout}}
<div class="header">
    <div class="full-name">
        <span class="first-name">{{name}}</span>
        <span class="last-name">{{lastName}}</span>
    </div>
    <div class="contact-info">
        <span class="email">Email: </span>
        <span class="email-val">{{email}}</span>
        <span class="separator"></span>
        <span class="phone">Phone: </span>
        <span class="phone-val">{{phone}}</span>
    </div>
    {{#if socialMedia}}
    <div class="social-media-info">
        {{#each socialMedia}}
        <a class="social-media-item" href="{{url}}" target="_blank" rel="noopener noreferrer">
            <span class="social-name">{{platform}}</span>
        </a>
        {{/each}}
    </div>
    {{/if}}
    <div class="about">
        <span class="position">{{aboutTitle}}</span>
        <span class="desc">{{aboutDescription}}</span>
    </div>
</div>
{{/if}}`,

  sectionTitle: `<div class="section__title">{{title}}</div>`,

  experience: `{{#if hasItems}}
<div class="section section__experience">
    {{> sectionTitle title=title}}
    <div class="section__list">
        {{#each items}}
        <div class="section__list-item">
            <div class="left">
                <div>
                <div class="name">Company: {{job_name}}</div>
                <div class="name">Position: {{position_name}}</div>
                </div>
                <div>
                <div class="addr">Place: {{addr}}</div>
                <div class="duration">Duration: {{duration_start}} - {{duration_end}}</div>
                </div>
            </div>
            <div class="right">
                <div class="desc">{{pos_description}}</div>
            </div>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}`,

  education: `{{#if hasItems}}
<div class="section">
    {{> sectionTitle title=title}}
    <div class="section__list">
        {{#each items}}
        <div class="section__list-item">
            <div class="left">
                <div class="name">{{institute_name}}</div>
                <div class="addr">{{addr}}</div>
                <div class="duration">{{duration_start}} - {{duration_end}}</div>
            </div>
            <div class="right">
                <div class="name">{{grade_name}}</div>
                <div class="desc">{{pos_description}}</div>
            </div>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}`,

  projects: `{{#if hasItems}}
<div class="section">
    {{> sectionTitle title=title}}
    <div class="section__list">
        {{#each items}}
        <div class="section__list-item">
            <div class="name">{{name}}</div>
            <div class="text">{{pos_description}}</div>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}`,

  skills: `{{#if hasItems}}
<div class="section">
    {{> sectionTitle title=title}}
    <div class="skills">
        {{#each items}}
        <div class="skills__item">
            <div class="left"><div class="name">{{name}}</div></div>
            <div class="right">
                {{#each levels}}
                <input type="checkbox" {{#if this}}checked{{/if}} readonly="true" />
                <label></label>
                {{/each}}
            </div>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}`,

  interests: `{{#if hasItems}}
<div class="section">
    {{> sectionTitle title=title}}
    <div class="section__list">
        <div class="section__list-item">
            {{#each items}}
            <span>{{this}} - </span>
            {{/each}}
        </div>
    </div>
</div>
{{/if}}`,

  language: `{{#if hasItems}}
<div class="section__language">
    {{> sectionTitle title=title}}
    <div class="section__list">
        {{#each items}}
        <div class="section__list-item">
            <div class="name">{{name}}</div>
            <div class="addr">{{level}}</div>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}`
};
