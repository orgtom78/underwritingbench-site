/**
 * Expression-of-interest form.
 *
 * FORM_GUID — HubSpot form GUID for portal 149355855.
 * While this stays "REPLACE_WITH_HUBSPOT_FORM_GUID", the form does not
 * send a request. Replace that placeholder to turn sending on.
 * See the README.
 */
const FORM_GUID = "REPLACE_WITH_HUBSPOT_FORM_GUID";

(function () {
  const PORTAL_ID = "149355855";
  const PLACEHOLDER_GUID = "REPLACE_WITH_HUBSPOT_FORM_GUID";
  const form = document.querySelector("#eoi-form");
  if (!form) return;

  const errorBox = document.querySelector("#form-error");
  const successBox = document.querySelector("#form-success");
  const submitButton = form.querySelector("[type='submit']");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    const data = readForm(form);
    const problems = validate(data);
    if (problems.length) {
      showProblems(problems);
      return;
    }

    const payload = {
      fields: buildFields(data),
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    if (FORM_GUID === PLACEHOLDER_GUID) {
      console.warn(
        "UWBench form is not wired yet. FORM_GUID in js/form.js is still the placeholder, so this note was not sent."
      );
      showSuccess(
        "Thank you. Your note is complete. This preview form is not connected yet, so nothing was sent."
      );
      return;
    }

    submitButton.disabled = true;
    const url =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      PORTAL_ID +
      "/" +
      FORM_GUID;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HubSpot returned " + response.status);
        }
        showSuccess("Thank you. We have your interest. We will reply by email.");
      })
      .catch(function () {
        showError("We could not send that. Please try again, or book a call.");
        submitButton.disabled = false;
      });
  });

  function readForm(source) {
    const interest = source.querySelector("input[name='interest']:checked");
    return {
      name: source.name.value,
      organization: source.organization.value,
      role: source.role.value,
      email: source.email.value,
      interest: interest ? interest.value : "",
    };
  }

  function validate(data) {
    const problems = [];
    const email = data.email.trim();
    const emailInput = form.email;
    emailInput.removeAttribute("aria-invalid");
    emailInput.removeAttribute("aria-describedby");

    if (!email) {
      problems.push({
        field: emailInput,
        message: "Enter your email address.",
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      problems.push({
        field: emailInput,
        message: "Enter a valid email address.",
      });
    }

    if (!data.interest) {
      problems.push({
        field: form.querySelector("input[name='interest']"),
        message: "Choose how you want to take part.",
      });
    }
    return problems;
  }

  function buildFields(data) {
    const fields = [];
    const name = data.name.trim().replace(/\s+/g, " ");
    if (name) {
      const splitAt = name.indexOf(" ");
      if (splitAt === -1) {
        fields.push({ name: "firstname", value: name });
      } else {
        fields.push({ name: "firstname", value: name.slice(0, splitAt) });
        fields.push({ name: "lastname", value: name.slice(splitAt + 1) });
      }
    }
    const organization = data.organization.trim();
    const role = data.role.trim();
    if (organization) fields.push({ name: "company", value: organization });
    if (role) fields.push({ name: "jobtitle", value: role });
    fields.push({ name: "email", value: data.email.trim() });
    fields.push({ name: "uwbench_interest", value: data.interest });
    return fields;
  }

  function showProblems(problems) {
    problems.forEach(function (problem) {
      problem.field.setAttribute("aria-invalid", "true");
      const described = problem.field.id + "-error";
      const slot = document.getElementById(described);
      if (slot) slot.textContent = problem.message;
      problem.field.setAttribute("aria-describedby", described);
    });
    errorBox.hidden = false;
    errorBox.textContent = problems[0].message;
    problems[0].field.focus();
  }

  function showError(message) {
    errorBox.hidden = false;
    errorBox.textContent = message;
    errorBox.focus();
  }

  function showSuccess(message) {
    form.hidden = true;
    successBox.hidden = false;
    successBox.textContent = message;
    successBox.focus();
  }

  function clearStatus() {
    errorBox.hidden = true;
    errorBox.textContent = "";
    form.querySelectorAll("[aria-invalid]").forEach(function (field) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".field-error").forEach(function (slot) {
      slot.textContent = "";
    });
  }
})();
