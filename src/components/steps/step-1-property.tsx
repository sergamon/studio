'use client';

import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { properties } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Step1PropertyProps {
  onNext: () => void;
}

const Step1Property = ({ onNext }: Step1PropertyProps) => {
  const { control } = useFormContext();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-bold">{t('step_property')}</h2>
      
      <FormField
        control={control}
        name="property"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_property')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('field_property')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {properties.map((prop) => (
                  <SelectItem key={prop} value={prop}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_email')}</FormLabel>
            <FormControl>
              <Input placeholder="name@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button onClick={onNext}>{t('send')}</Button>
      </div>
    </div>
  );
};

export default Step1Property;
