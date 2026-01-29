'use client';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { documentTypes } from '@/lib/constants';
import { countries } from '@/lib/countries';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import CountryCodeSelector from '../country-code-selector';

interface Step3DataProps {
  onNext: () => void;
  onBack: () => void;
  guestIndex: number;
}

const Step3Data = ({ onNext, onBack, guestIndex }: Step3DataProps) => {
  const { control, watch, setValue } = useFormContext();
  const { t } = useLanguage();

  const nationalityMode = watch(`guests.${guestIndex}.nationalityMode`);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-bold">{t('step_data')} {guestIndex > 0 ? `(${t('guest')} ${guestIndex + 1})` : ''}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField control={control} name={`guests.${guestIndex}.fullName`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_fullname')}</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.idNumber`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_idnum')}</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.documentType`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_doctype')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder={t('field_doctype')} /></SelectTrigger></FormControl>
              <SelectContent>{documentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.birthDate`} render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{t('field_birth')}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      field.value
                    ) : (
                      <span>{t('select_date')}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? parse(field.value, 'dd/mm/yyyy', new Date()) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(format(date, 'dd/MM/yyyy'));
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.nationalityMode`} render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{t('field_nat_mode')}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === 'Colombia') {
                    setValue(`guests.${guestIndex}.nationality`, 'COLOMBIA', { shouldValidate: true });
                  }
                }}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Colombia" /></FormControl><FormLabel className="font-normal">{t('field_nat_col')}</FormLabel></FormItem>
                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Otra" /></FormControl><FormLabel className="font-normal">{t('field_nat_other')}</FormLabel></FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {nationalityMode === 'Otra' && (
          <FormField control={control} name={`guests.${guestIndex}.nationality`} render={({ field }) => (
            <FormItem>
              <FormLabel>{t('field_nat_list')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder={t('field_nat_list')} /></SelectTrigger></FormControl>
                <SelectContent>{countries.map(c => <SelectItem key={c.label} value={c.label.toUpperCase()}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        )}
        <FormField control={control} name={`guests.${guestIndex}.countryOfOrigin`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_origin')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder={t('field_origin')} /></SelectTrigger></FormControl>
              <SelectContent>{countries.map(c => <SelectItem key={c.label} value={c.label.toUpperCase()}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.nextDestination`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_next')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder={t('field_next')} /></SelectTrigger></FormControl>
              <SelectContent>{countries.map(c => <SelectItem key={c.label} value={c.label.toUpperCase()}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="md:col-span-2">
          <FormLabel>{t('field_phone')}</FormLabel>
          <div className="flex gap-2">
            <FormField
              control={control}
              name={`guests.${guestIndex}.phoneCountryCode`}
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormControl>
                    <CountryCodeSelector
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`guests.${guestIndex}.phone`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input type="tel" placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField control={control} name={`guests.${guestIndex}.cityOfResidence`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_city')}</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`guests.${guestIndex}.flightNumber`} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('field_flight')} (Optional)</FormLabel>
            <FormControl><Input placeholder="AA1234" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>{t('correct')}</Button>
        <Button onClick={onNext}>{t('send')}</Button>
      </div>
    </div>
  );
};

export default Step3Data;
