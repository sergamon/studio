'use server';
/**
 * @fileOverview An ID data extraction AI agent.
 *
 * - extractDataFromID - A function that handles the data extraction process from an ID document.
 * - ExtractDataFromIDInput - The input type for the extractDataFromID function.
 * - ExtractDataFromIDOutput - The return type for the extractDataFromID function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractDataFromIDInputSchema = z.object({
  frontPhotoDataUri: z
    .string()
    .describe(
      "The front photo of an ID document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "The back photo of an ID document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDataFromIDInput = z.infer<typeof ExtractDataFromIDInputSchema>;

const ExtractDataFromIDOutputSchema = z.object({
  full_name: z.string().optional().describe('The full name extracted from the ID.'),
  document_type: z.string().optional().describe('The document type extracted from the ID.'),
  identification_number: z.string().optional().describe('The identification number extracted from the ID.'),
  birthdate_ddmmyyyy: z.string().optional().describe('The birthdate extracted from the ID in dd/mm/yyyy format.'),
  nationality_label: z.string().optional().describe('The nationality label extracted from the ID.'),
  ocr_raw_json: z.string().optional().describe('The raw JSON output from the OCR process.'),
  ocr_confidence_json: z.string().optional().describe('The confidence scores from the OCR process as JSON.'),
});
export type ExtractDataFromIDOutput = z.infer<typeof ExtractDataFromIDOutputSchema>;

export async function extractDataFromID(input: ExtractDataFromIDInput): Promise<ExtractDataFromIDOutput> {
  return extractDataFromIDFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataFromIDPrompt',
  input: { schema: ExtractDataFromIDInputSchema },
  output: { schema: ExtractDataFromIDOutputSchema },
  prompt: `You are an expert OCR data extraction specialist with advanced capabilities in analyzing identity documents from both front and back sides.

You will extract the following fields from the provided ID document images:
- full_name
- document_type: Identify the type of document (e.g., "Cédula de Ciudadanía", "Pasaporte", "Cédula de Extranjería").
- identification_number: Find the main identification number on the document. It might be labeled as "No.", "DOCUMENTO", "NÚMERO", etc.
- birthdate_ddmmyyyy
- nationality_label: The nationality of the person.

Examine both the front and back of the document to gather all required information. The back of the document may contain critical information not visible on the front.

Pay close attention to the 'nationality_label'. If the nationality is not explicitly written, you must deduce it from the context of the document. Analyze visual cues such as flags, logos, symbols, or the issuing country of the document to determine the nationality. For example, if the document is a "Cédula de Ciudadanía" from "República de Colombia", the nationality is "COLOMBIA".

Return the extracted data in JSON format.

Use the following as the primary source of information about the ID document.

Front Photo: {{media url=frontPhotoDataUri}}
{{#if backPhotoDataUri}}
Back Photo: {{media url=backPhotoDataUri}}
{{/if}}
`,
});

const extractDataFromIDFlow = ai.defineFlow(
  {
    name: 'extractDataFromIDFlow',
    inputSchema: ExtractDataFromIDInputSchema,
    outputSchema: ExtractDataFromIDOutputSchema,
  },
  async (input: any) => {
    const { output } = await prompt(input);
    return output!;
  }
);
