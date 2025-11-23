// Node build script (run with `node build.js`)
const fs = require('fs');
const path = require('path');

const tpl = fs.readFileSync(path.join(__dirname, 'site', 'template.html'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'content.json'), 'utf8'));

function render(tpl, data) {
    let out = tpl;
    out = out.replace(/{{hero.title}}/g, data.hero.title || '');
    out = out.replace(/{{hero.text}}/g, data.hero.text || '');

    // stats
    const statsTplMatch = out.match(/([\s\S]*?){{#stats}}([\s\S]*?){{\/stats}}([\s\S]*)/);
    if (statsTplMatch) {
        const statsInner = statsTplMatch[2];
        const renderedStats = (data.stats || []).map(s => statsInner.replace(/{{value}}/g, s.value || '').replace(/{{label}}/g, s.label || '')).join('\n');
        out = out.replace(statsTplMatch[0], statsTplMatch[1] + renderedStats + statsTplMatch[3]);
    }

    // work
    const workTplMatch = out.match(/([\s\S]*?){{#work}}([\s\S]*?){{\/work}}([\s\S]*)/);
    if (workTplMatch) {
        const workInner = workTplMatch[2];
        const renderedWork = (data.work || []).map(w => workInner.replace(/{{title}}/g, w.title || '').replace(/{{category}}/g, w.category || '').replace(/{{image}}/g, w.image || '')).join('\n');
        out = out.replace(workTplMatch[0], workTplMatch[1] + renderedWork + workTplMatch[3]);
    }

    // services
    const serviceTplMatch = out.match(/([\s\S]*?){{#services}}([\s\S]*?){{\/services}}([\s\S]*)/);
    if (serviceTplMatch) {
        const serviceInner = serviceTplMatch[2];
        const renderedServices = (data.services || []).map(s => serviceInner.replace(/{{title}}/g, s.title || '').replace(/{{desc}}/g, s.desc || '')).join('\n');
        out = out.replace(serviceTplMatch[0], serviceTplMatch[1] + renderedServices + serviceTplMatch[3]);
    }

    // team
    const teamTplMatch = out.match(/([\s\S]*?){{#team}}([\s\S]*?){{\/team}}([\s\S]*)/);
    if (teamTplMatch) {
        const teamInner = teamTplMatch[2];
        const renderedTeam = (data.team || []).map(t => teamInner.replace(/{{name}}/g, t.name || '').replace(/{{role}}/g, t.role || '').replace(/{{photo}}/g, t.photo || '')).join('\n');
        out = out.replace(teamTplMatch[0], teamTplMatch[1] + renderedTeam + teamTplMatch[3]);
    }

    // pricing
    const pricingTplMatch = out.match(/([\s\S]*?){{#pricing}}([\s\S]*?){{\/pricing}}([\s\S]*)/);
    if (pricingTplMatch) {
        const pricingInner = pricingTplMatch[2];
        const renderedPricing = (data.pricing || []).map(p => {
            let item = pricingInner.replace(/{{title}}/g, p.title || '').replace(/{{price}}/g, p.price || '');
            // points loop inside pricing
            const pointsMatch = item.match(/([\s\S]*?){{#points}}([\s\S]*?){{\/points}}([\s\S]*)/);
            if (pointsMatch) {
                const pointInner = pointsMatch[2];
                const renderedPoints = (p.points || []).map(pt => pointInner.replace(/{{.}}/g, pt)).join('\n');
                item = item.replace(pointsMatch[0], pointsMatch[1] + renderedPoints + pointsMatch[3]);
            }
            return item;
        }).join('\n');
        out = out.replace(pricingTplMatch[0], pricingTplMatch[1] + renderedPricing + pricingTplMatch[3]);
    }

    // faq
    const faqTplMatch = out.match(/([\s\S]*?){{#faq}}([\s\S]*?){{\/faq}}([\s\S]*)/);
    if (faqTplMatch) {
        const faqInner = faqTplMatch[2];
        const renderedFaq = (data.faq || []).map(f => faqInner.replace(/{{question}}/g, f.question || '').replace(/{{answer}}/g, f.answer || '')).join('\n');
        out = out.replace(faqTplMatch[0], faqTplMatch[1] + renderedFaq + faqTplMatch[3]);
    }

    // footer
    out = out.replace(/{{footer.email}}/g, data.footer?.email || '');
    out = out.replace(/{{footer.phone}}/g, data.footer?.phone || '');
    return out;
}

const result = render(tpl, data);
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), result);
console.log('Built /dist/index.html');