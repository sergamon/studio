'use client';

import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface Step4ConsentProps {
  onNext: () => void;
  onBack: () => void;
}

const consents: { name: 'consentEntry' | 'consentTra' | 'consentMig' | 'consentDp'; labelKey: 'consent_entry' | 'consent_tra' | 'consent_mig' | 'consent_dp' }[] = [
  { name: 'consentEntry', labelKey: 'consent_entry' },
  { name: 'consentTra', labelKey: 'consent_tra' },
  { name: 'consentMig', labelKey: 'consent_mig' },
  { name: 'consentDp', labelKey: 'consent_dp' },
];

const Step4Consent = ({ onNext, onBack }: Step4ConsentProps) => {
  const { control } = useFormContext();
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-headline font-bold">{t('step_consent')}</h2>
      
      <div className="space-y-4">
        {consents.map(({ name, labelKey }) => (
          <FormField
            key={name}
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">{t(labelKey)}</FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={control}
          name="swornStatement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium leading-relaxed italic">
                  {t('sworn_statement')}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="text-center text-xs text-muted-foreground pt-4">
        {lang === 'es' ? (
          <p>Al continuar, usted acepta nuestro <a href="#" className="underline text-primary hover:text-primary/80">Aviso de Privacidad</a>.</p>
        ) : (
          <p>By continuing, you agree to our <a href="#" className="underline text-primary hover:text-primary/80">Privacy Notice</a>.</p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>{t('correct')}</Button>
        <Button onClick={onNext}>{t('send')}</Button>
      </div>
    </div>
  );
};

export default Step4Consent;
