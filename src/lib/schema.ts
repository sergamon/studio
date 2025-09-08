import { z } from 'zod';

const GuestSchema = z.object({
  fullName: z.string().min(1, 'errors_required'),
  documentType: z.string().min(1, 'errors_required'),
  idNumber: z.string().min(1, 'errors_required').transform(val => val.replace(/\s+/g, '').toUpperCase()),
  birthDate: z.string()
    .min(1, 'errors_required')
    .refine(val => {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return false;
      const [day, month, year] = val.split('/').map(Number);
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) return false;
      const birthDate = new Date(year, month - 1, day);
      if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
        return false;
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 14;
    }, 'errors_birth'),
  nationalityMode: z.enum(['Colombia', 'Otra']),
  nationality: z.string().min(1, 'errors_required').transform(v => v.toUpperCase()),
  countryOfOrigin: z.string().min(1, 'errors_required'),
  nextDestination: z.string().min(1, 'errors_required'),
  phone: z.string().min(1, 'errors_required').regex(/^\d{7,15}$/, 'errors_phone'),
  phoneCountryCode: z.string().min(1, 'errors_required'),
  cityOfResidence: z.string().min(1, 'errors_required'),
  flightNumber: z.string().optional().refine( (val) => !val || /^[A-Za-z]{2}\d{3,4}$/.test(val) ),
  idFrontUrl: z.string().min(1, 'errors_doc_required'),
  idBackUrl: z.string().optional(),
});

export const FormSchema = z.object({
  property: z.string().min(1, 'errors_required'),
  email: z.string().email('errors_email').min(1, 'errors_required'),
  guests: z.array(GuestSchema).min(1),
  consentEntry: z.literal(true, { errorMap: () => ({ message: 'errors_consents' }) }),
  consentTra: z.literal(true, { errorMap: () => ({ message: 'errors_consents' }) }),
  consentMig: z.literal(true, { errorMap: () => ({ message: 'errors_consents' }) }),
  consentDp: z.literal(true, { errorMap: () => ({ message: 'errors_consents' }) }),
  signature: z.string().min(1, 'errors_signature'),
}).superRefine((data, ctx) => {
    data.guests.forEach((guest, index) => {
        if (guest.phone && guest.phoneCountryCode) {
            const fullPhone = `+${guest.phoneCountryCode}${guest.phone}`;
             if (!/^\+[1-9]\d{1,14}$/.test(fullPhone)) {
                ctx.addIssue({
                    path: ['guests', index, 'phone'],
                    message: "errors_phone",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });
});

export type FormState = z.infer<typeof FormSchema>;
export type GuestState = z.infer<typeof GuestSchema>;
