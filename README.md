# UWBench site

Static landing page for UWBench, the underwriting benchmark. This is a draft preview. It is not live. It does not deploy anywhere, and it does not set a custom domain.

The future home is underwritingbench.com. Do not add a `CNAME` file, and do not change DNS from this repo.

## Structure

```
index.html          Landing page
404.html            Not-found page
css/styles.css      All styles
js/form.js          Expression-of-interest form
assets/             Logo, pitch video, poster, favicon images
favicon.ico         Browser icon, cropped from the logo mark
.nojekyll           Lets GitHub Pages serve the repo root as-is
```

Plain HTML, CSS, and a small script. There is no build step and no tracker. Headings use Work Sans. Body text uses Inter. Both load from Google Fonts.

## Preview locally

From the repo root:

```bash
python3 -m http.server 8080
```

Open http://127.0.0.1:8080/

Open http://127.0.0.1:8080/404.html to preview the not-found page. On GitHub Pages, that file is served for unknown paths. A plain Python server does not do that on its own.

Paths in the HTML start at the site root (`/css/styles.css`), so use a local server. Opening the file directly in a browser will not load the styles.

## Set the HubSpot form

The interest form posts JSON to HubSpot’s v3 submit API:

`https://api.hsforms.com/submissions/v3/integration/submit/149355855/{FORM_GUID}`

`FORM_GUID` is one constant at the top of `js/form.js`. The value in this repo is:

`REPLACE_WITH_HUBSPOT_FORM_GUID`

While that placeholder is in place, the form checks the email and the interest choice, then shows a success note on the page. It does **not** send the request. The browser console warns that the form is not wired yet.

To turn sending on:

1. Create the HubSpot form in portal `149355855`.
2. Add a custom contact property the form can store, named `uwbench_interest`.
3. Replace `FORM_GUID` in `js/form.js` with that form’s GUID.
4. Submit once and confirm the contact fields: `firstname`, `lastname` (when the name has more than one word), `company`, `jobtitle`, `email`, and `uwbench_interest`. The request also sends `context.pageUri` and `context.pageName`.

Email is the required field. Interest must be one of: Founding member, Contributor, Lender participant.

## Tone

Keep the page neutral. UWBench is an independent, nonprofit-bound benchmark. SecureLend is one participant and a founding contributor, and the conflict note says so. Do not turn this into a SecureLend product page. Do not name lenders or clients. Do not imply that official scores exist. The status on the page is public alpha, with no results published yet.
