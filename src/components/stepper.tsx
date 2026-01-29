'use client';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/i18n';

interface StepperProps {
  currentStep: number;
  steps: TranslationKey[];
  guestCount: number;
  currentGuestIndex: number;
}

const Stepper = ({ currentStep, steps, guestCount, currentGuestIndex }: StepperProps) => {
  const { t } = useLanguage();

  const getStepTitle = (stepKey: TranslationKey, index: number): string => {
    const baseTitle = t(stepKey);
    if (index > 0 && index < steps.length - 1) {
      if (guestCount > 1) {
        return `${baseTitle} (${t('guest')} ${currentGuestIndex + 1})`;
      }
    }
    return baseTitle;
  }

  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((stepKey, index) => (
          <li key={stepKey} className="md:flex-1">
            {index <= currentStep ? (
              <div
                className="group flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
              >
                <span className="text-sm font-headline font-semibold text-primary">{getStepTitle(stepKey, index)}</span>
              </div>
            ) : (
              <div
                className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0"
              >
                <span className="text-sm font-headline font-medium text-gray-500">{getStepTitle(stepKey, index)}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
