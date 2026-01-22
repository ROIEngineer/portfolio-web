const form = document.getElementById("contact-form");  // Link to HTML form
const status = document.getElementById("form-status"); // Link to status message

form.addEventListener("submit", async (e) => {
  // Stop page from refreshing
  e.preventDefault();

  // Declare the status
  status.textContent = "Sending message";

  // Destruct values from submitted form
  const formData = {
    firstName: form.first_name.value.trim(),
    lastName: form.last_name.value.trim(),
    email: form.user_email.value.trim(),
    subject: form.user_subject.value.trim(),
    message: form.user_message.value.trim(),
    company: form.company.value.trim(), // honeypot
  };

  try {
    const response = await fetch("https://portfolio-backend-resend.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      status.textContent = "Message sent successfully!";
      form.reset();
    } else {
      status.textContent = data.error || "Please check your information and try again.";
    }
  } catch (error) {
    status.textContent = "Server error. Please try again later.";
  }
});

// "https://portfolio-backend-b68z.onrender.com/api/contact"
