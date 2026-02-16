export const singleThemeTemplates = {
  header: `
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
    {{#if aboutTitle}}
    <div class="about">
        <span class="position">{{aboutTitle}}</span>
        <span class="desc">{{aboutDescription}}</span>
    </div>
    {{/if}}
</div>
`,

  sectionTitle: `
<div class="section__title">{{title}}</div>
`,

  experience: `
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
                <div class="name">Position: {{position_name}}</div>
                <div class="desc">{{pos_description}}</div>
            </div>
        </div>
        {{/each}}
    </div>
</div>
`,

  education: `
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
`,

  projects: `
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
`,

  skills: `
<div class="section">
    {{> sectionTitle title=title}}
    <div class="skills">
        {{#each items}}
        <div class="skills__item">
            <div class="left"><div class="name">{{name}}</div></div>
            <div class="right">
                {{#each (range level)}}
                <input id="{{../name}}_{{../id}}_ck{{this}}" type="checkbox" checked="true" readonly="true" />
                <label for="{{../name}}_{{../id}}_ck{{this}}"></label>
                {{/each}}
                {{#each (rangeEmpty 10 level)}}
                <input id="{{../name}}_{{../id}}_ck{{this}}" type="checkbox" readonly="true" />
                <label for="{{../name}}_{{../id}}_ck{{this}}"></label>
                {{/each}}
            </div>
        </div>
        {{/each}}
    </div>
</div>
`,

  interests: `
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
`,

  language: `
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
`
};
