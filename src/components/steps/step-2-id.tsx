'use client';
import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { extractDataFromID } from '@/ai/flows/extract-data-from-id';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileCheck, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';

interface Step2IdProps {
  onNext: () => void;
  onBack: () => void;
  guestIndex: number;
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
};

const FileUploader = ({ onFileUploaded, fieldName, label }: { onFileUploaded: (file: File, fieldName: string) => void; fieldName: string; label: string }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { getValues } = useFormContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoading(true);
      await onFileUploaded(file, fieldName);
      setLoading(false);
    }
  }, [onFileUploaded, fieldName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
    maxFiles: 1,
  });

  const uploadedFile = getValues(fieldName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : uploadedFile ? (
            <FileCheck className="h-8 w-8 text-green-500" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="mt-2 text-sm text-center text-muted-foreground">
            {loading ? t('processing...') : uploadedFile ? t('file_uploaded') : (isDragActive ? 'Drop the file here' : `Drag 'n' drop or click to upload`)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


const Step2Id = ({ onNext, onBack, guestIndex }: Step2IdProps) => {
  const { t } = useLanguage();
  const { setValue, getValues, formState: { errors } } = useFormContext();
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileUpload = async (file: File, fieldName: string) => {
    setValue(fieldName, file.name, { shouldValidate: true });
    
    // Only run OCR on the front image
    if (fieldName === `guests.${guestIndex}.idFrontUrl`) {
      setIsExtracting(true);
      try {
        const dataUri = await fileToDataUri(file);
        const result = await extractDataFromID({ photoDataUri: dataUri });

        if (result.full_name) setValue(`guests.${guestIndex}.fullName`, result.full_name, { shouldDirty: true });
        if (result.document_type) setValue(`guests.${guestIndex}.documentType`, result.document_type, { shouldDirty: true });
        if (result.identification_number) setValue(`guests.${guestIndex}.idNumber`, result.identification_number, { shouldDirty: true });
        if (result.birthdate_ddmmyyyy) setValue(`guests.${guestIndex}.birthDate`, result.birthdate_ddmmyyyy, { shouldDirty: true });
        if (result.nationality_label) {
            setValue(`guests.${guestIndex}.nationalityMode`, 'Otra', { shouldDirty: true });
            setValue(`guests.${guestIndex}.nationality`, result.nationality_label.toUpperCase(), { shouldDirty: true });
        }
        toast({ title: "Success", description: "Data extracted from ID." });
      } catch (error) {
        console.error('OCR Error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not extract data from the document.',
        });
      } finally {
        setIsExtracting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-bold">{t('step_id')} {guestIndex > 0 ? `(${t('guest')} ${guestIndex + 1})` : ''}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={useFormContext().control}
          name={`guests.${guestIndex}.idFrontUrl`}
          render={() => (
            <FormItem>
              <FormControl>
                <FileUploader onFileUploaded={handleFileUpload} fieldName={`guests.${guestIndex}.idFrontUrl`} label={t('upload_front')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileUploader onFileUploaded={handleFileUpload} fieldName={`guests.${guestIndex}.idBackUrl`} label={t('upload_back')} />
      </div>

      {(isExtracting) && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{t('extracting')}</span>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>{t('correct')}</Button>
        <Button onClick={onNext} disabled={isExtracting || !getValues(`guests.${guestIndex}.idFrontUrl`)}>
          {isExtracting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('send')}
        </Button>
      </div>
    </div>
  );
};

export default Step2Id;
