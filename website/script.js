const registerAPI = "https://ljzifdhihc.execute-api.us-east-1.amazonaws.com/prod1/register";
const requestAPI = "https://7yegfxgwv4.execute-api.us-east-1.amazonaws.com/prod2/request";

// Accept 10–15 digits; country code allowed but API receives last 10 digits.
const phoneRegex = /^[0-9]{10,15}$/;
// Basic RFC 5322-lite email check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function sanitizePhone(value) {
  // Remove everything except digits
  return value.trim().replace(/\D/g, "");
}

function last10Digits(value) {
  const digits = sanitizePhone(value);
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

const ApiService = {
  async submitDonorRegistration(payload) {
    return fetch(registerAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  async submitEmergencyRequest(payload) {
    return fetch(requestAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
};

function setError(field, message) {
  const errorNode = field.parentElement.querySelector(".error-message");
  field.classList.add("error");
  if (errorNode) errorNode.textContent = message;
}

function clearError(field) {
  const errorNode = field.parentElement.querySelector(".error-message");
  field.classList.remove("error");
  if (errorNode) errorNode.textContent = "";
}

function validateRequired(field, label) {
  if (!field.value.trim()) {
    setError(field, `${label} is required.`);
    return false;
  }
  clearError(field);
  return true;
}

function validateEmail(field, label) {
  if (!validateRequired(field, label)) return false;
  if (!emailRegex.test(field.value.trim())) {
    setError(field, `${label} must be a valid email address.`);
    return false;
  }
  clearError(field);
  return true;
}

function validatePhone(field, label) {
  if (!validateRequired(field, label)) return false;
  const digits = sanitizePhone(field.value);
  field.value = digits; // keep field clean and align with validation message
  if (!phoneRegex.test(digits)) {
    setError(field, `${label} must have 10 to 15 digits. Country code is optional; we'll use the last 10.`);
    return false;
  }
  clearError(field);
  return true;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setupScrollReveal() {
  const revealNodes = document.querySelectorAll(".reveal");
  if (!revealNodes.length || !("IntersectionObserver" in window)) return;

  revealNodes.forEach((node, index) => {
    if (!node.style.getPropertyValue("--reveal-delay")) {
      node.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupFormHandler(config) {
  const form = document.getElementById(config.formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let isValid = true;
    config.validators.forEach((validator) => {
      isValid = validator(form) && isValid;
    });
    if (!isValid) return;

    try {
      const payload = config.payloadBuilder(form);
      const response = await config.onSubmit(payload);

      if (response && response.ok) {
        alert(config.successMessage);
        form.reset();
        return;
      }

      showToast("Submission failed. Please try again.");
    } catch (error) {
      showToast("Submission failed. Please try again.");
    }
  });
}

function setupDonorForm() {
  setupFormHandler({
    formId: "registerForm",
    validators: [
      (form) => validateRequired(form.fullName, "Full Name"),
      (form) => validateEmail(form.email, "Email"),
      (form) => validateRequired(form.bloodGroup, "Blood Group"),
      (form) => validatePhone(form.mobile, "Mobile Number"),
      (form) => validateRequired(form.address, "Full Address"),
      (form) => validateRequired(form.city, "City")
    ],
    payloadBuilder: (form) => ({
      name: form.fullName.value.trim(),
      email: form.email.value.trim(),
      blood_group: form.bloodGroup.value,
      phone: last10Digits(form.mobile.value),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      health_issue: form.healthIssues.value.trim()
    }),
    onSubmit: (payload) => ApiService.submitDonorRegistration(payload),
    successMessage: "Donor Registered Successfully"
  });
}

function setupEmergencyRequestForm() {
  setupFormHandler({
    formId: "requestForm",
    validators: [
      (form) => validateRequired(form.neededGroup, "Blood Group Needed"),
      (form) => validateRequired(form.hospitalName, "Hospital Name"),
      (form) => validateRequired(form.hospitalAddress, "Hospital Address"),
      (form) => validateRequired(form.hospitalCity, "City"),
      (form) => validatePhone(form.hospitalContact, "Contact Number")
    ],
    payloadBuilder: (form) => ({
      blood_group: form.neededGroup.value,
      hospital: form.hospitalName.value.trim(),
      address: form.hospitalAddress.value.trim(),
      city: form.hospitalCity.value.trim(),
      contact: last10Digits(form.hospitalContact.value)
    }),
    onSubmit: (payload) => ApiService.submitEmergencyRequest(payload),
    successMessage: "Blood Request Sent Successfully"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupDonorForm();
  setupEmergencyRequestForm();
  setupScrollReveal();
});
