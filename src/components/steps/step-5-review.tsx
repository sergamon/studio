'use client';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Edit } from 'lucide-react';
import type { FormState } from '@/lib/schema';

interface Step5ReviewProps {
  onBack: () => void;
  onSubmit: () => void;
  addGuest: () => void;
  editGuest: (index: number) => void;
}

const ReviewItem = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground text-right">{value}</p>
        </div>
    );
};


const Step5Review = ({ onBack, onSubmit, addGuest, editGuest }: Step5ReviewProps) => {
  const { watch } = useFormContext<FormState>();
  const { t } = useLanguage();
  const formData = watch();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-headline font-bold">{t('review_summary_title')}</h2>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">{t('field_property')}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
            <ReviewItem label={t('field_property')} value={formData.property} />
            <ReviewItem label={t('field_email')} value={formData.email} />
        </CardContent>
      </Card>

      {formData.guests.map((guest, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('guest')} {index + 1}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => editGuest(index)}><Edit className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <ReviewItem label={t('field_fullname')} value={guest.fullName} />
            <ReviewItem label={t('field_idnum')} value={guest.idNumber} />
            <ReviewItem label={t('field_doctype')} value={guest.documentType} />
            <ReviewItem label={t('field_birth')} value={guest.birthDate} />
            <ReviewItem label={t('field_nat_mode')} value={guest.nationality} />
            <ReviewItem label={t('field_origin')} value={guest.countryOfOrigin} />
            <ReviewItem label={t('field_next')} value={guest.nextDestination} />
            <ReviewItem label={t('field_phone')} value={guest.phone} />
            <ReviewItem label={t('field_city')} value={guest.cityOfResidence} />
            <ReviewItem label={t('field_flight')} value={guest.flightNumber} />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button variant="outline" onClick={addGuest}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('add_guest')}
        </Button>
      </div>

      <Separator />

      <Card>
        <CardHeader><CardTitle className="text-lg">{t('step_consent')}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
            <p className="text-sm text-foreground">{formData.consentEntry ? '✅' : '❌'} {t('consent_entry')}</p>
            <p className="text-sm text-foreground">{formData.consentTra ? '✅' : '❌'} {t('consent_tra')}</p>
            <p className="text-sm text-foreground">{formData.consentMig ? '✅' : '❌'} {t('consent_mig')}</p>
            <p className="text-sm text-foreground">{formData.consentDp ? '✅' : '❌'} {t('consent_dp')}</p>
            <div className="pt-4">
                <p className="text-sm font-medium text-muted-foreground">{t('signature')}</p>
                {formData.signature ? <img src={formData.signature} alt="User signature" className="mt-2 bg-white border rounded-md max-w-xs" /> : <p className="text-sm text-destructive">{t('errors_signature')}</p>}
            </div>
        </CardContent>
      </Card>


      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>{t('correct')}</Button>
        <Button onClick={onSubmit}>{t('send')}</Button>
      </div>
    </div>
  );
};

export default Step5Review;
