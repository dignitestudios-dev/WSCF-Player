export const policyContent: Record<PolicyModalType, { title: string; sections: PolicySection[] }> = {
  terms: {
    title: "Terms & Conditions",
    sections: [
      {
        title: "1. Acceptance of Terms",
        paragraphs: [
          'By accessing or using our mobile application (the "App"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use the App.',
        ],
      },
      {
        title: "2. User Conduct",
        paragraphs: ["You agree not to:"],
        bullets: [
          "Use the App for any illegal or unauthorized purpose.",
          "Interfere with the security or functionality of the App.",
          "Attempt to gain unauthorized access to the App or its systems.",
          "Use the App in a way that could harm, disable, overburden, or impair the App or interfere with other users' enjoyment of the App.",
        ],
      },
      {
        title: "3. Intellectual Property",
        paragraphs: [
          "All content and materials on the App, including but not limited to text, graphics, logos, images, and software, are the property or its licensors and are protected by copyright and other intellectual property laws.",
        ],
      },
      {
        title: "4. Disclaimer of Warranties",
        paragraphs: [
          'The App is provided "as is" without warranty of any kind, express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        title: "1. Information We Collect",
        paragraphs: [
          "We may collect personal information that you provide directly to us, including your name, email address, and account details when you register or use our services.",
        ],
      },
      {
        title: "2. How We Use Your Information",
        paragraphs: [
          "We use the information we collect to provide, maintain, and improve our services, process registrations, communicate with you, and ensure the security of our platform.",
        ],
      },
      {
        title: "3. Information Sharing",
        paragraphs: [
          "We do not sell your personal information. We may share information with service providers who assist us in operating the App, or when required by law.",
        ],
      },
      {
        title: "4. Data Security",
        paragraphs: [
          "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        ],
      },
      {
        title: "5. Your Rights",
        paragraphs: [
          "You may request access to, correction of, or deletion of your personal information by contacting us through the support channels provided in the App.",
        ],
      },
    ],
  },
};
