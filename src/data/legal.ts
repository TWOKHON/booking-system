import { cache } from "react";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  label: string;
  effectiveDate: string;
  intro: string[];
  sections: LegalSection[];
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
};

const termsDocument: LegalDocument = {
  label: "Terms of Service",
  title: "Terms of Service - ResortCloud",
  effectiveDate: "March 29, 2026",
  intro: [
    'We are ResortCloud, Inc ("Company," "we," "us," and "our").',
    'We operate the website https://resortcloud.com (the "Site"), the ResortCloud application (the "App"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").',
    "You can contact us by email at support@resortcloud.com.",
    'These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and ResortCloud, Inc, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.',
    'Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.',
    "The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services.",
    "We recommend that you print a copy of these Legal Terms for your records.",
  ],
  sections: [
    {
      title: "1. Our Services",
      paragraphs: [
        "The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.",
        "Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.",
        "The Services are not tailored to comply with industry-specific regulations such as HIPAA, FISMA, or similar frameworks. If your use of the Services would subject us to such laws, you may not use the Services in that manner.",
      ],
    },
    {
      title: "2. Intellectual Property Rights",
      paragraphs: [
        "We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, text, photographs, graphics, and other materials in the Services, together with the trademarks, service marks, and logos contained therein.",
        "Our Content and Marks are protected by copyright, trademark, and other intellectual property laws and treaties throughout the world.",
        'The Content and Marks are provided in or through the Services "AS IS" for your internal business use only.',
        "Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access solely for your internal business use.",
        "Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever without our express prior written permission.",
        "If you wish to make any use of the Services, Content, or Marks other than as set out in these Legal Terms, please address your request to support@resortcloud.com.",
        "We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.",
        "Any breach of these Intellectual Property Rights will constitute a material breach of these Legal Terms and your right to use our Services will terminate immediately.",
      ],
      bullets: [
        "Submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services, you agree to assign to us all intellectual property rights in such Submission.",
        'You are responsible for what you submit and confirm that your submissions are lawful, original or properly licensed, non-confidential, and do not violate our "Prohibited Activities" section or third-party rights.',
        "You agree to reimburse us for losses resulting from your breach of these submission obligations, any third-party intellectual property claim, or any violation of applicable law.",
      ],
    },
    {
      title: "3. User Representations",
      paragraphs: [
        "By using the Services, you represent and warrant that all registration information you submit will be true, accurate, current, and complete and that you will maintain the accuracy of such information and promptly update it as necessary.",
        "You further represent that you have the legal capacity to agree to these Legal Terms, that you are not a minor in the jurisdiction in which you reside, that you will not access the Services through automated or non-human means except as expressly permitted, and that your use of the Services will not violate any applicable law or regulation.",
        "If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any current or future use of the Services.",
      ],
    },
    {
      title: "4. User Registration",
      paragraphs: [
        "You may be required to register to use the Services. You agree to keep your password confidential and remain responsible for all use of your account and password.",
        "We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.",
      ],
    },
    {
      title: "5. Prohibited Activities",
      paragraphs: [
        "You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.",
      ],
      bullets: [
        "Systematically retrieve data or other content from the Services to create a collection, compilation, database, or directory without written permission from us",
        "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords",
        "Circumvent, disable, or otherwise interfere with security-related features of the Services",
        "Disparage, tarnish, or otherwise harm us or the Services",
        "Use information obtained from the Services in order to harass, abuse, or harm another person",
        "Make improper use of our support services or submit false reports of abuse or misconduct",
        "Use the Services in a manner inconsistent with any applicable laws or regulations",
        "Engage in unauthorized framing of or linking to the Services",
        "Upload or transmit viruses, Trojan horses, spam, or other harmful material that interferes with the Services",
        "Engage in automated use of the system, including scripts, scraping, robots, or unauthorized data gathering tools",
        "Delete the copyright or other proprietary rights notice from any Content",
        "Attempt to impersonate another user or person or use the username of another user",
        "Upload or transmit spyware, passive collection mechanisms, or similar tracking tools through the Services",
        "Interfere with, disrupt, or create an undue burden on the Services or connected networks",
        "Harass, annoy, intimidate, or threaten our employees or agents",
        "Attempt to bypass any measures designed to prevent or restrict access to the Services",
        "Copy or adapt the Services' software, including source or front-end code",
        "Except as permitted by law, decipher, decompile, disassemble, or reverse engineer any software comprising part of the Services",
        "Use any buying agent or purchasing agent to make purchases on the Services",
        "Collect usernames and email addresses for unsolicited communications or create accounts under false pretenses",
        "Use the Services to compete with us or for any unauthorized revenue-generating endeavor",
        "Sell or otherwise transfer your profile",
      ],
    },
    {
      title: "6. User Generated Contributions",
      paragraphs: [
        "The Services do not generally offer users the ability to publicly submit or post content. However, if we provide opportunities for you to create, submit, transmit, or otherwise make available content, such content may be treated in accordance with the Services' Privacy Policy.",
        "When you create or make available any Contributions, you represent and warrant that your Contributions do not infringe third-party rights, are not false or misleading, are not unlawful or abusive, and do not violate these Legal Terms or applicable law.",
      ],
    },
    {
      title: "7. Contribution License",
      paragraphs: [
        "You and the Services agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices, including settings.",
        "By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.",
        "We do not assert ownership over your Contributions. You retain ownership of your Contributions and associated rights, but you are solely responsible for them and agree not to hold us liable for them.",
      ],
    },
    {
      title: "8. Mobile Application License",
      paragraphs: [
        "If you access the Services via the App, we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on devices owned or controlled by you strictly in accordance with these Legal Terms.",
        "You shall not decompile, reverse engineer, create derivative works, remove proprietary notices, make the App available over a network for simultaneous use, use it to build a competing product, or use our intellectual property in connection with unauthorized applications or devices.",
        "If you obtain the App through an App Distributor such as Apple or Google, you agree that the App Distributor is a third-party beneficiary of the relevant app license terms and that your use must comply with the applicable App Distributor terms.",
      ],
    },
    {
      title: "9. Social Media",
      paragraphs: [
        "As part of the functionality of the Services, you may be able to link your account with third-party accounts. By doing so, you represent that you are entitled to disclose the login information and grant us access without breaching the terms of those third-party services.",
        "We may access, make available, and store content from linked third-party accounts to the extent permitted by the settings and permissions you authorize. Your relationship with those third-party providers is governed solely by your agreements with them.",
      ],
    },
    {
      title: "10. Third-Party Websites and Content",
      paragraphs: [
        "The Services may contain links to other websites and third-party content. We do not investigate, monitor, or check such third-party materials for accuracy, appropriateness, or completeness.",
        "If you choose to access third-party websites or content, you do so at your own risk and should review the applicable third-party terms, policies, and privacy practices.",
      ],
    },
    {
      title: "11. Services Management",
      paragraphs: [
        "We reserve the right, but not the obligation, to monitor the Services for violations of these Legal Terms, take appropriate legal action against violators, refuse or restrict access, remove excessive or burdensome content, and otherwise manage the Services in a manner designed to protect our rights and facilitate proper platform functioning.",
      ],
    },
    {
      title: "12. Privacy Policy",
      paragraphs: [
        "We care about data privacy and security. Please review our Privacy Policy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.",
        "If you access the Services from a jurisdiction with laws governing personal data collection, use, or disclosure that differ from applicable laws where the Services are hosted, your continued use of the Services may involve transfer and processing of your data in other jurisdictions.",
      ],
    },
    {
      title: "13. Term and Termination",
      paragraphs: [
        "These Legal Terms remain in full force and effect while you use the Services.",
        "We reserve the right, in our sole discretion and without notice or liability, to deny access to and use of the Services, terminate your account, or block certain IP addresses for any reason, including for breach of these Legal Terms or any applicable law or regulation.",
        "If your account is terminated or suspended, you may not create a new account under your own name, a false name, or the name of another person or entity.",
      ],
    },
    {
      title: "14. Modifications and Interruptions",
      paragraphs: [
        "We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason without notice.",
        "We cannot guarantee the Services will be available at all times. We may experience interruptions, delays, or errors due to maintenance, hardware issues, software issues, or third-party dependencies.",
      ],
    },
    {
      title: "15. Governing Law",
      paragraphs: [
        "These Legal Terms and your use of the Services are governed by and construed in accordance with the laws applicable to ResortCloud's operating jurisdiction, without regard to conflict of law principles.",
      ],
    },
    {
      title: "16. Dispute Resolution",
      paragraphs: [
        "Any legal action or proceeding arising out of or relating to the Services shall be brought in the competent courts designated by ResortCloud's governing legal framework, unless otherwise required by applicable law.",
        "To the maximum extent permitted, any claim arising out of or related to the Services must be brought within one year after the cause of action arose.",
      ],
    },
    {
      title: "17. Corrections",
      paragraphs: [
        "There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and other information. We reserve the right to correct such errors and update the information at any time without prior notice.",
      ],
    },
    {
      title: "18. Disclaimer",
      paragraphs: [
        'THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        "We make no warranties regarding the accuracy or completeness of the Services' content or the content of any linked websites or applications and assume no responsibility for errors, interruptions, unauthorized access, malware, or other issues arising from use of the Services.",
      ],
    },
    {
      title: "19. Limitations of Liability",
      paragraphs: [
        "In no event will we or our directors, employees, or agents be liable to you or any third party for direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the Services, even if advised of the possibility of such damages.",
        "Notwithstanding anything to the contrary, our liability to you for any cause whatsoever will at all times be limited to the amount paid, if any, by you to us during the one-month period prior to the cause of action arising, to the extent permitted by law.",
      ],
    },
    {
      title: "20. Indemnification",
      paragraphs: [
        "You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and personnel, from any loss, damage, liability, claim, or demand arising out of your use of the Services, breach of these Legal Terms, violation of third-party rights, or harmful acts toward other users.",
      ],
    },
    {
      title: "21. User Data",
      paragraphs: [
        "We maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services.",
        "Although we perform routine backups, you are solely responsible for all data that you transmit or that relates to activity you undertake using the Services. You waive any right of action against us arising from loss or corruption of such data.",
      ],
    },
    {
      title: "22. Electronic Communications, Transactions, and Signatures",
      paragraphs: [
        "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and agree that all agreements, notices, disclosures, and other communications we provide electronically satisfy any legal requirement that such communication be in writing.",
        "You agree to the use of electronic signatures, contracts, orders, and records, and to electronic delivery of notices, policies, and transaction records initiated or completed by us or via the Services.",
      ],
    },
    {
      title: "23. California Users and Residents",
      paragraphs: [
        "If any complaint with us is not satisfactorily resolved, California users may contact the appropriate complaint assistance authorities of the California Department of Consumer Affairs or other applicable agencies.",
      ],
    },
    {
      title: "24. Miscellaneous",
      paragraphs: [
        "These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us.",
        "Our failure to enforce any right or provision shall not operate as a waiver. If any provision is determined to be unlawful, void, or unenforceable, that provision is severable and does not affect the validity of the remaining provisions.",
        "No joint venture, partnership, employment, or agency relationship is created between you and us as a result of these Legal Terms or use of the Services.",
      ],
    },
  ],
  contactTitle: "25. Contact Us",
  contactBody:
    "In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:",
  contactEmail: "support@resortcloud.com",
};

const privacyDocument: LegalDocument = {
  label: "Privacy Policy",
  title: "Privacy Policy - ResortCloud",
  effectiveDate: "March 29, 2026",
  intro: [
    "How ResortCloud collects, uses, and protects your data while using our services.",
    'At ResortCloud, we take your privacy seriously and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you access and use our website, ResortCloud, as well as our resort operations, scheduling, booking, and management services (collectively referred to as the "Service").',
    "By using the Service, you agree to the terms of this Privacy Policy.",
  ],
  sections: [
    {
      title: "1. Information We Collect",
      paragraphs: [
        "We collect two types of information.",
        "1.1. User-Provided Information: When you register for an account or use our Service, you may provide us with personal information, including but not limited to your name, email address, other contact details, resort information, booking details, operational data, and information related to the workflows you manage through our Service.",
        "1.2. Automatically Collected Information: When you access the Service, certain information may be collected automatically, including your IP address, browser type, device type, and other technical information. We may also use cookies and similar tracking technologies to collect data about your interactions with our Service.",
      ],
    },
    {
      title: "2. How We Use Information",
      paragraphs: [
        "We use the information we collect for the following purposes.",
        "2.1. Providing the Service: We use your information to create and manage your account, allow you to use our booking, operations, scheduling, and management tools, and provide customer support.",
        "2.2. Improving the Service: We analyze user data to improve our Service, develop new features, and enhance user experience.",
        "2.3. Communication: We may send you information about the Service, updates, and promotional materials. You can opt out of these communications at any time.",
        "2.4. Legal Requirements: We may use your data to comply with applicable legal obligations, such as responding to legal requests and enforcing our Terms of Use.",
        "2.5. Use of Google User Data (Optional Integration): Our Service may offer optional integrations with Google APIs to enhance functionality. These features are available only if you actively choose to enable them. Activation may grant us access to, use, storage, and potential sharing of specific Google user data such as name, email, Gmail metadata, and message content where required for the enabled workflow.",
        "Any Google user data accessed through optional integrations is used exclusively to support and improve the specific Service features you elect to use. We do not use Google user data to develop, improve, or train generalized AI and/or ML models.",
        "Our platform may incorporate AI systems and large language model providers through third-party APIs in order to power features you intentionally enable. Where such integrations are used, only the data necessary to perform the requested task is shared.",
        "You retain control over optional integrations and may disconnect them at any time. Once disconnected, no new data from that integration will be shared for future tasks.",
      ],
    },
    {
      title: "3. Data Sharing",
      paragraphs: [
        "We do not sell, rent, or trade your personal information to third parties.",
        "3.1. Service Providers: We may share information with third-party service providers who assist us in providing and improving the Service.",
        "3.2. Legal Requirements: We may share information in response to valid legal requests or to protect our rights, privacy, safety, or property.",
        "3.3. Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your data may be transferred as part of the transaction.",
      ],
    },
    {
      title: "4. Security Measures",
      paragraphs: [
        "We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.",
        "However, no method of data transmission over the Internet or electronic storage is entirely secure, and we cannot guarantee the absolute security of your information.",
      ],
    },
    {
      title: "5. Your Choices",
      paragraphs: [
        "You have the following choices regarding your personal information.",
        "5.1. Access and Update: You may access and update your account information at any time through the Service.",
        "5.2. Communications: You can opt out of receiving promotional communications from us.",
        "5.3. Deactivation: You can deactivate your account at any time by contacting us.",
        "You may also request deletion of certain data by emailing support@resortcloud.com, subject to our legal, operational, and security obligations.",
      ],
    },
    {
      title: "6. Children’s Privacy",
      paragraphs: [
        "Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children.",
        "If you believe we have collected personal information from a child under 13, please contact us, and we will take appropriate action.",
      ],
    },
    {
      title: "7. Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.",
        "We will post the revised Privacy Policy with an updated effective date on our website.",
      ],
    },
  ],
  contactTitle: "8. Contact Us",
  contactBody:
    "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:",
  contactEmail: "support@resortcloud.com",
};

export const getTermsDocument = cache(async () => termsDocument);
export const getPrivacyDocument = cache(async () => privacyDocument);
