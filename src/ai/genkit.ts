// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai';

export const ai = {
  definePrompt: () => (async () => ({ output: {} })),
  defineFlow: (config: any, fn: any) => fn,
} as any;
// genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-2.5-flash',
// });
