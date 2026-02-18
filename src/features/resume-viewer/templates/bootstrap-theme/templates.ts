export const bootstrapThemeTemplates = {
  layout: `
    <div class="container-xl bootstrap-resume">
      <div class="row">
        <div class="col-12">
          {{{header}}}
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          {{{language}}}
          {{{experience}}}
          {{{education}}}
        </div>
        <div class="col-12 col-md-6">
          {{{projects}}}
          {{{skills}}}
          {{{interests}}}
        </div>
      </div>
    </div>
  `,
  styles: `
    .bootstrap-resume { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .bootstrap-resume .card { border: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; margin-bottom: 20px; }
    .bootstrap-resume .card-header { border-radius: 8px 8px 0 0 !important; padding: 12px 20px; background-color: rgba(0,0,0,.03); }
    .bootstrap-resume .card-header h5 { margin: 0; font-weight: 600; }
    .bootstrap-resume .card-body { padding: 20px; }
    .bootstrap-resume .display-4 { font-weight: 700; color: #333; }
    .bootstrap-resume .timeline { position: relative; padding-left: 20px; }
    .bootstrap-resume .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #dee2e6; }
    .bootstrap-resume .timeline > div { position: relative; padding-left: 15px; margin-bottom: 15px; }
    .bootstrap-resume .timeline > div::before { content: ''; position: absolute; left: -23px; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: #0d6efd; }
    .bootstrap-resume .progress { border-radius: 4px; background: #e9ecef; height: 1rem; }
    .bootstrap-resume .badge { font-weight: 500; padding: 5px 10px; }
    @media (max-width: 768px) {
        .bootstrap-resume .display-4 { font-size: 1.8rem; }
        .bootstrap-resume .timeline { padding-left: 15px; }
        .bootstrap-resume .timeline > div::before { left: -18px; }
    }
  `,
  externalCss: [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
  ],
  header: `
<div class="card mb-4">
    <div class="card-body">
        <div class="row">
            <div class="col-12">
                <h1 class="display-4 mb-0">{{name}} {{lastName}}</h1>
            </div>
        </div>
        {{#if aboutTitle}}
        <div class="row mt-3">
            <div class="col-12">
                <h4 class="text-muted">{{aboutTitle}}</h4>
                <p class="lead">{{aboutDescription}}</p>
            </div>
        </div>
        {{/if}}
        <div class="row mt-3">
            <div class="col-12 col-md-6 mb-2 mb-md-0">
                <i class="fa fa-envelope me-2"></i>
                <strong>Email:</strong> {{email}}
            </div>
            <div class="col-12 col-md-6">
                <i class="fa fa-phone me-2"></i>
                <strong>Phone:</strong> {{phone}}
            </div>
        </div>
        {{#if socialMedia}}
        <div class="row mt-3">
            <div class="col-12">
                <div class="d-flex flex-wrap gap-2">
                    {{#each socialMedia}}
                    <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">
                        <i class="fa fa-link me-1"></i>{{platform}}
                    </a>
                    {{/each}}
                </div>
            </div>
        </div>
        {{/if}}
    </div>
</div>
`,

  experience: `
<div class="card mb-4">
    <div class="card-header bg-primary text-white">
        <h5 class="mb-0"><i class="fa fa-briefcase me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        <div class="timeline">
            {{#each items}}
            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                        <h6 class="mb-1">{{job_name}}</h6>
                        <p class="mb-1 text-muted">{{position_name}}</p>
                    </div>
                    <span class="badge bg-secondary">{{duration_start}} - {{duration_end}}</span>
                </div>
                <small class="text-muted"><i class="fa fa-map-marker me-1"></i>{{addr}}</small>
                {{#if pos_description}}
                <p class="mt-2 mb-0">{{pos_description}}</p>
                {{/if}}
            </div>
            {{/each}}
        </div>
    </div>
</div>
`,

  education: `
<div class="card mb-4">
    <div class="card-header bg-success text-white">
        <h5 class="mb-0"><i class="fa fa-graduation-cap me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        {{#each items}}
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                    <h6 class="mb-1">{{institute_name}}</h6>
                    <p class="mb-1 text-muted">{{grade_name}}</p>
                </div>
                <span class="badge bg-secondary">{{duration_start}} - {{duration_end}}</span>
            </div>
            <small class="text-muted"><i class="fa fa-map-marker me-1"></i>{{addr}}</small>
            {{#if pos_description}}
            <p class="mt-2 mb-0">{{pos_description}}</p>
            {{/if}}
        </div>
        {{/each}}
    </div>
</div>
`,

  projects: `
<div class="card mb-4">
    <div class="card-header bg-info text-white">
        <h5 class="mb-0"><i class="fa fa-folder-open me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        {{#each items}}
        <div class="mb-3">
            <h6 class="mb-1">{{name}}</h6>
            <p class="mb-0 text-muted">{{pos_description}}</p>
        </div>
        {{/each}}
    </div>
</div>
`,

  skills: `
<div class="card mb-4">
    <div class="card-header bg-warning text-dark">
        <h5 class="mb-0"><i class="fa fa-cogs me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        {{#each items}}
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-bold">{{name}}</span>
                <span class="badge bg-dark">{{level}}/10</span>
            </div>
            <div class="progress" style="height: 8px">
                <div class="progress-bar bg-warning" role="progressbar" style="width: {{multiply level 10}}%"></div>
            </div>
        </div>
        {{/each}}
    </div>
</div>
`,

  interests: `
<div class="card mb-4">
    <div class="card-header bg-secondary text-white">
        <h5 class="mb-0"><i class="fa fa-heart me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        <div class="d-flex flex-wrap gap-2">
            {{#each items}}
            <span class="badge bg-light text-dark">{{this}}</span>
            {{/each}}
        </div>
    </div>
</div>
`,

  language: `
<div class="card mb-4">
    <div class="card-header bg-danger text-white">
        <h5 class="mb-0"><i class="fa fa-language me-2"></i>{{title}}</h5>
    </div>
    <div class="card-body">
        <table class="table table-striped mb-0">
            <tbody>
                {{#each items}}
                <tr>
                    <td class="fw-bold">{{name}}</td>
                    <td>{{level}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>
    </div>
</div>
`
};
