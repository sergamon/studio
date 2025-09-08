'use client';

import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Step6ConfirmationProps {
  onReset: () => void;
}

const Step6Confirmation = ({ onReset }: Step6ConfirmationProps) => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-headline pt-4">{t('confirm_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {t('lang') === 'es' ? 'Gracias por completar su registro. Sus datos han sido enviados de forma segura.' : 'Thank you for completing your registration. Your data has been submitted securely.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => { /* PDF download logic */ }}>{t('pdf_download')}</Button>
              <Button variant="outline" onClick={onReset}>{t('new_registration')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Step6Confirmation;
