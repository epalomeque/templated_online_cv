export const darkThemeTemplates = {
  layout: `
    <div class="dark-theme min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8 font-sans">
      <div class="max-w-4xl mx-auto space-y-8">
        {{{header}}}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-1 space-y-8">
            {{{language}}}
            {{{skills}}}
            {{{interests}}}
          </div>
          <div class="md:col-span-2 space-y-8">
            {{{experience}}}
            {{{education}}}
            {{{projects}}}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    /* Tailwind utility classes are used directly in templates */
    .dark-theme h2, .dark-theme h3 { color: #38bdf8; }
    .dark-theme .section-card { background: #1e293b; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
  `,
  externalCss: [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
  ],
  header: `
    <header class="section-card flex flex-col md:flex-row items-center gap-6">
      {{#if picture}}
      <img src="{{picture}}" alt="{{name}}" class="w-32 h-32 rounded-full border-4 border-sky-500 shadow-lg object-cover">
      {{/if}}
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-2">{{name}} <span class="text-sky-400">{{lastName}}</span></h1>
        {{#if aboutTitle}}
        <h2 class="text-xl font-semibold text-sky-400 mb-4">{{aboutTitle}}</h2>
        {{/if}}
        <div class="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
          <div class="flex items-center gap-2"><i class="fa fa-envelope text-sky-500"></i>{{email}}</div>
          <div class="flex items-center gap-2"><i class="fa fa-phone text-sky-500"></i>{{phone}}</div>
        </div>
        {{#if socialMedia}}
        <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
          {{#each socialMedia}}
          <a href="{{url}}" target="_blank" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium rounded-full transition-colors border border-slate-700">
            {{platform}}
          </a>
          {{/each}}
        </div>
        {{/if}}
      </div>
    </header>
    {{#if aboutDescription}}
    <div class="section-card mt-4">
       <p class="text-slate-300 leading-relaxed">{{aboutDescription}}</p>
    </div>
    {{/if}}
  `,
  sectionTitle: `<h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">{{title}}</h3>`,
  experience: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-briefcase"></i> {{title}}
      </h3>
      <div class="space-y-6">
        {{#each items}}
        <div class="relative pl-6 border-l-2 border-slate-700">
          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sky-500 border-4 border-slate-900"></div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
            <h4 class="text-lg font-bold text-white">{{job_name}}</h4>
            <span class="text-sm font-medium text-sky-400">{{duration_start}} - {{duration_end}}</span>
          </div>
          <div class="text-sky-300 font-medium mb-2">{{position_name}} | <span class="text-slate-400 text-sm">{{addr}}</span></div>
          <p class="text-slate-400 text-sm leading-relaxed">{{pos_description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
  {{/if}}`,
  education: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-graduation-cap"></i> {{title}}
      </h3>
      <div class="space-y-6">
        {{#each items}}
        <div class="relative pl-6 border-l-2 border-slate-700">
          <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900"></div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
            <h4 class="text-lg font-bold text-white">{{institute_name}}</h4>
            <span class="text-sm font-medium text-emerald-400">{{duration_start}} - {{duration_end}}</span>
          </div>
          <div class="text-emerald-300 font-medium mb-2">{{grade_name}} | <span class="text-slate-400 text-sm">{{addr}}</span></div>
          <p class="text-slate-400 text-sm leading-relaxed">{{pos_description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
  {{/if}}`,
  projects: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-code"></i> {{title}}
      </h3>
      <div class="grid grid-cols-1 gap-4">
        {{#each items}}
        <div class="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-sky-500/50 transition-colors">
          <h4 class="font-bold text-white mb-2">{{name}}</h4>
          <p class="text-slate-400 text-sm leading-relaxed">{{pos_description}}</p>
        </div>
        {{/each}}
      </div>
    </section>
  {{/if}}`,
  skills: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-gears"></i> {{title}}
      </h3>
      <div class="space-y-4">
        {{#each items}}
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="font-medium text-slate-300">{{name}}</span>
            <span class="text-sky-400">{{level}}/10</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div class="bg-sky-500 h-1.5 rounded-full" style="width: {{multiply level 10}}%"></div>
          </div>
        </div>
        {{/each}}
      </div>
    </section>
  {{/if}}`,
  language: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-language"></i> {{title}}
      </h3>
      <div class="flex flex-wrap gap-2">
        {{#each items}}
        <div class="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-sm">
          <span class="text-white font-medium">{{name}}:</span>
          <span class="text-sky-400 ml-1">{{level}}</span>
        </div>
        {{/each}}
      </div>
    </section>
  {{/if}}`,
  interests: `{{#if hasItems}}
    <section class="section-card">
      <h3 class="text-lg font-bold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
        <i class="fa fa-heart"></i> {{title}}
      </h3>
      <div class="flex flex-wrap gap-2">
        {{#each items}}
        <span class="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded border border-slate-700">{{this}}</span>
        {{/each}}
      </div>
    </section>
  {{/if}}`
};
