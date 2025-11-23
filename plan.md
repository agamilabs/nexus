# Awake — Editor + Static Build (Option A)

This repository contains a **zero-cost**, **no-backend** site editor and build workflow for the `Awake-clone-tailwind` static site. Your manager can edit content in a friendly in-browser editor and **download** a ready-to-serve static `index.html`. A Node build script is included for automated local builds if you (or your developer) prefer.

---

## Project structure

```
/ (root)
  /editor/index.html       # Manager-facing editor (runs in browser, no server required)
  /site/template.html      # Tailwind site template with placeholders
  /data/content.json       # Content file (editable JSON)
  /build.js                # Node.js build script (optional, for local automation)
  /dist/                   # Output when using build.js (or downloaded from editor)
```

---

## How it works (two ways)

### 1) Quick (no install) — Manager-only workflow (recommended)

* Open `/editor/index.html` in a browser (double-click the file). It runs entirely in the browser.
* The editor will load `content.json` if present, or start with defaults.
* Edit text, add/remove items, and use **Download content.json** to save changes.
* Use **Download built site** to generate the full `index.html` and download it. That `index.html` is the final static site you can upload to any host (Netlify, Vercel, S3, FTP).

**No backend, no Node required.** Perfect for non-technical managers.

### 2) Developer workflow (optional) — Automated local builds

* Place `content.json` in `/data/` and run `node build.js`.
* `build.js` will read `site/template.html` and create `/dist/index.html` by injecting JSON content.
* You can then deploy `/dist/` to any static host.

---

## Files (contents)

### 1) `/editor/index.html` (In-browser editor + build)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Awake — Content Editor</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;}</style>
</head>
<body class="bg-gray-50 p-6">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
    <h1 class="text-2xl font-bold mb-2">Awake — Content Editor (Option A)</h1>
    <p class="text-sm text-gray-600 mb-4">Edit site content below. Use <strong>Download content.json</strong> to save or <strong>Download built site</strong> to get a ready-to-deploy index.html.</p>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Hero Title</label>
        <input id="heroTitle" class="mt-1 w-full rounded border-gray-200 p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Hero Subtitle</label>
        <input id="heroSubtitle" class="mt-1 w-full rounded border-gray-200 p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium">Hero Paragraph</label>
        <textarea id="heroText" class="mt-1 w-full rounded border-gray-200 p-2" rows="3"></textarea>
      </div>

      <hr />

      <div>
        <label class="block text-sm font-medium">Services (JSON array)</label>
        <textarea id="services" class="mt-1 w-full rounded border-gray-200 p-2" rows="6"></textarea>
        <div class="text-xs text-gray-500 mt-1">Example: [{"title":"Brand Strategy","desc":"..."}, {"title":"Product Design","desc":"..."}]</div>
      </div>

      <div>
        <label class="block text-sm font-medium">Team (JSON array)</label>
        <textarea id="team" class="mt-1 w-full rounded border-gray-200 p-2" rows="6"></textarea>
        <div class="text-xs text-gray-500 mt-1">Example: [{"name":"Alex Kim","role":"Creative Director","photo":""}] (photo can be URL)</div>
      </div>

      <div>
        <label class="block text-sm font-medium">Pricing (JSON array)</label>
        <textarea id="pricing" class="mt-1 w-full rounded border-gray-200 p-2" rows="6"></textarea>
      </div>

      <div class="flex gap-2 mt-4">
        <button id="loadSample" class="px-4 py-2 rounded bg-gray-100">Load sample</button>
        <button id="downloadJson" class="px-4 py-2 rounded bg-blue-600 text-white">Download content.json</button>
        <button id="downloadSite" class="px-4 py-2 rounded bg-green-600 text-white">Download built site</button>
        <input id="fileInput" type="file" accept="application/json" class="hidden" />
        <button id="uploadJson" class="px-4 py-2 rounded bg-yellow-400 text-black">Upload content.json</button>
      </div>

      <div class="mt-4 text-sm text-gray-500">Tip: if you have images, use public image URLs. The downloaded site will reference the URLs as-is.</div>
    </div>
  </div>

  <script>
    const sample = {
      "hero": {
        "title": "We build brands that Awaken attention.",
        "subtitle": "Creative Strategy & Design",
        "text": "Digital-first design and strategy for brands who want to be noticed. From identity to product and campaigns — we deliver measurable creativity."
      },
      "services": [
        {"title":"Brand Strategy","desc":"Insight-driven brand strategy to position your product and message."},
        {"title":"Product Design","desc":"UX/UI design that converts and delights users across platforms."},
        {"title":"Campaigns & Growth","desc":"Creative campaigns that scale with measurable performance."}
      ],
      "team":[
        {"name":"Alex Kim","role":"Creative Director","photo":""},
        {"name":"Priya Rao","role":"Head of Strategy","photo":""}
      ],
      "pricing":[
        {"title":"Starter","price":"$2,500","points":["Brand audit","1 campaign","Up to 6 weeks"]},
        {"title":"Growth","price":"$6,500","points":["Full brand & product design","3 campaigns","12 weeks"]}
      ],
      "footer": {"email":"hello@awake.example","phone":"+1 (555) 123-4567"}
    };

    // elements
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroText = document.getElementById('heroText');
    const servicesEl = document.getElementById('services');
    const teamEl = document.getElementById('team');
    const pricingEl = document.getElementById('pricing');

    function loadToForm(data){
      heroTitle.value = data.hero.title || '';
      heroSubtitle.value = data.hero.subtitle || '';
      heroText.value = data.hero.text || '';
      servicesEl.value = JSON.stringify(data.services || [], null, 2);
      teamEl.value = JSON.stringify(data.team || [], null, 2);
      pricingEl.value = JSON.stringify(data.pricing || [], null, 2);
    }

    function formToJson(){
      try{
        return {
          hero: { title: heroTitle.value, subtitle: heroSubtitle.value, text: heroText.value },
          services: JSON.parse(servicesEl.value || '[]'),
          team: JSON.parse(teamEl.value || '[]'),
          pricing: JSON.parse(pricingEl.value || '[]'),
          footer: { email: 'hello@awake.example', phone: '+1 (555) 123-4567' }
        };
      }catch(e){
        alert('JSON parse error: ' + e.message);
        throw e;
      }
    }

    document.getElementById('loadSample').addEventListener('click', ()=> loadToForm(sample));

    document.getElementById('downloadJson').addEventListener('click', ()=>{
      const data = formToJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'content.json'; a.click();
      URL.revokeObjectURL(url);
    });

    // download built site: use template embedded below as a string
    document.getElementById('downloadSite').addEventListener('click', ()=>{
      const data = formToJson();
      // fetch template (embedded below as a string)
      const template = window.__TEMPLATE_HTML__;
      const out = template.replace(/__JSON_CONTENT__/g, function(){
        return JSON.stringify(data).replaceAll('<','\\u003c');
      });
      const blob = new Blob([out], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'index.html'; a.click(); URL.revokeObjectURL(url);
    });

    document.getElementById('uploadJson').addEventListener('click', ()=> document.getElementById('fileInput').click());

    document.getElementById('fileInput').addEventListener('change', (e)=>{
      const f = e.target.files[0];
      if(!f) return;
      const r = new FileReader();
      r.onload = ()=>{
        try{
          const parsed = JSON.parse(r.result);
          loadToForm(parsed);
          alert('content.json loaded');
        }catch(err){ alert('Invalid JSON'); }
      };
      r.readAsText(f);
    });

    // initialize with sample
    loadToForm(sample);

  </script>

  <!-- The site template used for building: injected into downloaded HTML via JS above -->
  <script>
    // Minimal Tailwind template — the build step will replace __JSON_CONTENT__ with site data
    window.__TEMPLATE_HTML__ = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Awake — Agency</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>.max-w-site{max-width:1200px}</style>
</head>
<body class="antialiased text-gray-700">
  <div id="app"></div>
  <script>
    const CONTENT = __JSON_CONTENT__;
    // render simplified single-page site using CONTENT
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="bg-white shadow-sm">
        <div class="max-w-site mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center">A</div><div class="font-semibold">Awake</div></div>
        </div>
      </header>
      <main>
        <section class="py-20">
          <div class="max-w-site mx-auto px-6">
            <h2 class="text-4xl font-extrabold">${'${CONTENT.hero.title}'}</h2>
            <p class="mt-4 text-lg text-gray-600">${'${CONTENT.hero.text}'}</p>
          </div>
        </section>
        <section class="py-12 bg-gray-50">
          <div class="max-w-site mx-auto px-6 grid md:grid-cols-3 gap-4">
            ${'${CONTENT.services.map(s=>`<div class="p-6 bg-white rounded"><h3 class="font-semibold">${s.title}</h3><p class="text-sm text-gray-500 mt-2">${s.desc}</p></div>`).join("")}' }
          </div>
        </section>
      </main>
    `;
  </script>
</body>
</html>`;
  </script>
</body>
</html>
```

> This editor is intentionally simple and works entirely in the browser. It lets your manager edit JSON content and download the generated `index.html` (the output contains Tailwind via CDN). Images should be referenced with public URLs.

---

### 2) `/site/template.html` (Developer template used by `build.js`)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Awake — Agency</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>.max-w-site{max-width:1200px}</style>
</head>
<body class="antialiased text-gray-700">
  <header class="bg-white shadow-sm">
    <div class="max-w-site mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3"><div class="w-10 h-10 bg-brand-700 text-white rounded flex items-center justify-center">A</div><div class="font-semibold">Awake</div></div>
    </div>
  </header>

  <main>
    <section class="py-20">
      <div class="max-w-site mx-auto px-6">
        <h1 class="text-4xl font-extrabold">{{hero.title}}</h1>
        <p class="mt-4 text-lg text-gray-600">{{hero.text}}</p>
      </div>
    </section>

    <section class="py-12 bg-gray-50">
      <div class="max-w-site mx-auto px-6 grid md:grid-cols-3 gap-4">
        {{#services}}
        <div class="p-6 bg-white rounded">
          <h3 class="font-semibold">{{title}}</h3>
          <p class="text-sm text-gray-500 mt-2">{{desc}}</p>
        </div>
        {{/services}}
      </div>
    </section>

  </main>
</body>
</html>
```

> `{{...}}` placeholders are replaced by `build.js`.

---

### 3) `/data/content.json` (sample)

```json
{
  "hero": {
    "title": "We build brands that Awaken attention.",
    "subtitle": "Creative Strategy & Design",
    "text": "Digital-first design and strategy for brands who want to be noticed."
  },
  "services": [
    {"title":"Brand Strategy","desc":"Insight-driven brand strategy."},
    {"title":"Product Design","desc":"UX/UI that converts."}
  ],
  "team": [{"name":"Alex Kim","role":"Creative Director","photo":""}],
  "pricing": [{"title":"Starter","price":"$2,500","points":["Audit","1 campaign"]}],
  "footer": {"email":"hello@awake.example","phone":"+1 (555) 123-4567"}
}
```

---

### 4) `/build.js` (Node script — optional)

```js
// Node build script (run with `node build.js`)
const fs = require('fs');
const path = require('path');

const tpl = fs.readFileSync(path.join(__dirname,'site','template.html'),'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data','content.json'),'utf8'));

function render(tpl, data){
  let out = tpl;
  out = out.replace(/{{hero.title}}/g, data.hero.title || '');
  out = out.replace(/{{hero.text}}/g, data.hero.text || '');

  // services
  const serviceTplMatch = tpl.match(/([\s\S]*?){{#services}}([\s\S]*?){{\/services}}([\s\S]*)/);
  if(serviceTplMatch){
    const serviceInner = serviceTplMatch[2];
    const renderedServices = (data.services||[]).map(s=> serviceInner.replace(/{{title}}/g,s.title||'').replace(/{{desc}}/g,s.desc||'')).join('\n');
    out = out.replace(serviceTplMatch[0], serviceTplMatch[1] + renderedServices + serviceTplMatch[3]);
  }
  return out;
}

const result = render(tpl,data);
fs.mkdirSync(path.join(__dirname,'dist'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'dist','index.html'), result);
console.log('Built /dist/index.html');
```

---

## Deployment

* After you have `index.html` (from the editor download or `/dist/index.html`), deploy to any static host: Netlify, Vercel, GitHub Pages, S3 + CloudFront, or simple FTP/cPanel.

## Next steps I can do for you (choose any):

1. Add image upload support (uploads to S3 or a free image host) — requires a small backend or using third-party image host APIs.
2. Make the editor collaborative with a simple GitHub workflow (commits content.json to a repo on save) — requires GitHub OAuth and a serverless function.
3. Convert to a Bootstrap version or split the site into components.
4. Package this as a downloadable zip of all files so your manager can run it locally.

---

If you'd like, I will now **add the editor, template, sample content.json and build.js into the canvas** so you can open and copy each file. Say **"Add files to canvas"** and I'll commit them for you (ready to copy/download).
