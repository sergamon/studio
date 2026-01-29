'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { extractDataFromID } from '@/ai/flows/extract-data-from-id';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/ui/camera-capture';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Step2IdProps {
  onNext: () => void;
  onBack: () => void;
  guestIndex: number;
}

// Utility to compress image data URI
const compressImage = (dataUri: string, maxWidth = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = dataUri;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      console.error("Image load error in compressImage", err);
      reject(new Error("Failed to load image for compression"));
    };
  });
};

export default function Step2Id({ onNext, onBack, guestIndex }: Step2IdProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { control, setValue, getValues } = useFormContext();

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStep, setExtractionStep] = useState<string>('');

  const handleCapture = async (imageSrc: string, fieldName: string) => {
    // Compress immediately upon capture to save memory and avoid huge payloads
    try {
      console.log(`Attempting compression for ${fieldName}, length: ${imageSrc.length}`);
      const compressed = await compressImage(imageSrc);
      console.log(`Compression successful for ${fieldName}, new length: ${compressed.length}`);
      setValue(fieldName, compressed, { shouldValidate: true, shouldDirty: true });
      toast({ description: t('file_uploaded') || "Image captured and optimized" });
    } catch (e) {
      console.error("Compression ended with error:", e);
      // Fallback to original image if compression fails
      console.log("Falling back to original image");
      setValue(fieldName, imageSrc, { shouldValidate: true, shouldDirty: true });
      toast({
        description: t('file_uploaded') || "Image captured (optimization skipped)",
        variant: "default"
      });
    }
  };

  const runOcr = async () => {
    const frontImageUri = getValues(`guests.${guestIndex}.idFrontUrl`);
    const backImageUri = getValues(`guests.${guestIndex}.idBackUrl`);

    if (!frontImageUri) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t('errors_doc_required')
      });
      return;
    }

    setIsExtracting(true);
    setExtractionStep('uploading'); // Initial state

    // Simulate different processing stages for UX
    const stepsTimeout = setTimeout(() => setExtractionStep('analyzing'), 2000);

    try {
      // images are already compressed during capture
      const result = await extractDataFromID({
        frontPhotoDataUri: frontImageUri,
        backPhotoDataUri: backImageUri || undefined,
      });

      // Haptic feedback for success
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }

      if (result.full_name) setValue(`guests.${guestIndex}.fullName`, result.full_name, { shouldDirty: true });
      if (result.document_type) setValue(`guests.${guestIndex}.documentType`, result.document_type, { shouldDirty: true });
      if (result.identification_number) setValue(`guests.${guestIndex}.idNumber`, result.identification_number, { shouldDirty: true });
      if (result.birthdate_ddmmyyyy) setValue(`guests.${guestIndex}.birthDate`, result.birthdate_ddmmyyyy, { shouldDirty: true });
      if (result.nationality_label) {
        setValue(`guests.${guestIndex}.nationalityMode`, 'Otra', { shouldDirty: true });
        setValue(`guests.${guestIndex}.nationality`, result.nationality_label.toUpperCase(), { shouldDirty: true });
      }

      toast({ title: "Success", description: "Document processed successfully." });
      onNext();
    } catch (error: any) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }

      console.error('AI Extraction Error:', error);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: error.message || 'Could not extract data. Please try again or enter manually.',
      });
    } finally {
      clearTimeout(stepsTimeout);
      setIsExtracting(false);
      setExtractionStep('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-bold">{t('step_id')} {guestIndex > 0 ? `(${t('guest')} ${guestIndex + 1})` : ''}</h2>

      {/* UX: Tips for better scanning */}
      <Alert className="bg-blue-50 border-blue-200 text-blue-900 shadow-sm">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="font-bold">{t('tips_title')}</AlertTitle>
        <AlertDescription className="text-blue-800">
          {t('tips_description')}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={control}
          name={`guests.${guestIndex}.idFrontUrl`}
          render={() => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  <CameraCapture
                    onCapture={(src) => handleCapture(src, `guests.${guestIndex}.idFrontUrl`)}
                    label={t('upload_front')}
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    {t('file_requirements')}
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Processing Overlay / State */}
      {isExtracting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-card p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full border">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">
                {extractionStep === 'uploading' && t('uploading')}
                {extractionStep === 'analyzing' && t('extracting')}
                {extractionStep === 'validating' && "Validating..."}
              </h3>
              <p className="text-sm text-muted-foreground">{t('processing...')}</p>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-in-out"
                style={{
                  width: extractionStep === 'uploading' ? '30%' :
                    extractionStep === 'analyzing' ? '60%' : '90%'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isExtracting}>{t('correct')}</Button>
        <Button onClick={runOcr} disabled={isExtracting || !getValues(`guests.${guestIndex}.idFrontUrl`)}>
          {t('extracting')}
        </Button>
      </div>
    </div>
  );
}
