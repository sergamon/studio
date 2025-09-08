# **App Name**: Hosty Access

## Core Features:

- Property Selection: Allows users to select the property they are visiting from a dropdown menu of predefined options.
- Document Scanning via OCR: Uses OCR technology to scan and extract data from identification documents (front and back) using the device's camera or uploaded files. Scanned documents are stored to Google Drive. This feature is mandatory and blocks progress until completed.
- Data Verification and Correction: Presents extracted data to the user, highlighting fields needing verification or completion. Edits are audited.
- Consent Collection: Collects user consents for building access, TRA (Tarjeta de Registro de Alojamiento), migratory registration, and data protection via mandatory checkboxes. Provides linked privacy notice.
- Digital Signature: Allows users to provide a digital signature via a signature pad, which is mandatory for completing the registration.
- Multi-Language Support (i18n): Offers a language switcher (ES/EN) in the header to dynamically update UI text, steps, buttons, errors, and consent messages, persisting the language preference in localStorage.
- Data Submission and PDF Generation: Submits collected data to Google Sheets, uploads files, saves URLs, generates a PDF in the selected language with all relevant information, and provides a confirmation message.

## Style Guidelines:

- Primary color: Deep Blue (#22427B), derived from the Hosty logo to evoke trust and professionalism.
- Background color: Light Gray (#F0F4F8), providing a clean and modern backdrop.
- Accent color: Orange (#E77121) to contrast and draw attention to the calls to action.
- Body text font: 'PT Sans', a humanist sans-serif that provides a modern and slightly warm feel, making it highly readable for both UI elements and body text. 
- Headline font: 'Space Grotesk', is a proportional sans-serif with a computerized, techy, scientific feel; This is matched to PT Sans for body.
- Use clear, minimalist icons to represent actions and data fields.
- Mobile-first responsive design with a stepper for progress indication, ensuring a seamless experience across devices.