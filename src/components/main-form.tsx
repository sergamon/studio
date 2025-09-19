'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, FormState, GuestState } from '@/lib/schema';
import { useLanguage } from '@/hooks/use-language';
import type { TranslationKey } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import Stepper from './stepper';
import Step1Property from './steps/step-1-property';
import Step2Id from './steps/step-2-id';
import Step3Data from './steps/step-3-data';
import Step4Consent from './steps/step-4-consent';
import Step5Review from './steps/step-5-review';
import Step6Confirmation from './steps/step-6-confirmation';

const defaultGuest: GuestState = {
  fullName: '',
  documentType: '',
  idNumber: '',
  birthDate: '',
  nationalityMode: 'Colombia',
  nationality: 'COLOMBIA',
  countryOfOrigin: 'COLOMBIA',
  nextDestination: 'COLOMBIA',
  phoneCountryCode: '57',
  phone: '',
  cityOfResidence: '',
  flightNumber: '',
  idFrontUrl: '',
  idBackUrl: '',
};

const STEPS: TranslationKey[] = [
  'step_property',
  'step_id',
  'step_data',
  'step_consent',
  'step_review'
];

export default function MainForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormState>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      property: '',
      email: '',
      guests: [defaultGuest],
      consentEntry: false,
      consentTra: false,
      consentMig: false,
      consentDp: false,
      signature: '',
    },
  });

  const { control, trigger, getValues, formState: { errors } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guests',
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormState)[] | `guests.${number}.${keyof GuestState}`[] = [];
    
    switch (currentStep) {
        case 0: // Property & Email
            fieldsToValidate = ['property', 'email'];
            break;
        case 1: // ID Scan
            fieldsToValidate = [`guests.${currentGuestIndex}.idFrontUrl`];
            break;
        case 2: // Guest Data
            fieldsToValidate = Object.keys(defaultGuest).map(key => `guests.${currentGuestIndex}.${key as keyof GuestState}`);
            break;
        case 3: // Consent
            fieldsToValidate = ['consentEntry', 'consentTra', 'consentMig', 'consentDp', 'signature'];
            break;
    }
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;

    if (isValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addGuest = () => {
    append(defaultGuest);
    setCurrentGuestIndex(fields.length);
    setCurrentStep(1); // Go to ID scan step for new guest
  };

  const editGuest = (index: number) => {
    setCurrentGuestIndex(index);
    setCurrentStep(1); // Go to ID scan for this guest
  };

  const finishGuestEditing = () => {
    setCurrentGuestIndex(0);
    setCurrentStep(4); // Back to review step
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const webhookUrl = 'https://primary-production-48a2.up.railway.app/webhook-test/1dfa428c-e3ab-464c-a634-9c30a68088a2';
    const formValues = getValues();
    
    const clients = formValues.guests.map(guest => ({
        ...guest,
        phone: `+${guest.phoneCountryCode}${guest.phone.replace(`+${guest.phoneCountryCode}`, '')}`,
        email: formValues.email,
        consentEntry: formValues.consentEntry,
        consentTra: formValues.consentTra,
        consentMig: formValues.consentMig,
        consentDp: formValues.consentDp,
        signature: formValues.signature,
    }));

    const finalData = {
      property: formValues.property,
      clients: clients
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error(`Webhook response was not ok: ${response.statusText}`);
      }

      console.log('Form Submitted:', finalData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form to webhook:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not submit registration. Please try again.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    methods.reset();
    setCurrentStep(0);
    setCurrentGuestIndex(0);
    setIsSubmitted(false);
    setIsSubmitting(false);
  }

  if (isSubmitted) {
    return <Step6Confirmation onReset={resetForm} />;
  }

  if (isSubmitting) {
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Sending registration...</p>
        </div>
      );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Property onNext={nextStep} />;
      case 1:
        return <Step2Id onNext={nextStep} onBack={prevStep} guestIndex={currentGuestIndex} />;
      case 2:
        return <Step3Data onNext={nextStep} onBack={prevStep} guestIndex={currentGuestIndex} />;
      case 3:
        return <Step4Consent onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step5Review onBack={prevStep} addGuest={addGuest} editGuest={editGuest} onSubmit={handleFinalSubmit} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Stepper currentStep={currentStep} steps={STEPS} guestCount={fields.length} currentGuestIndex={currentGuestIndex} />
          </div>
          <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
            {renderStep()}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
