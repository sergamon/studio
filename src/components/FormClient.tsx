'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SubmissionResult = Record<string, unknown> | string | null;

export default function FormClient() {
  const [property, setProperty] = useState('');
  const [source, setSource] = useState('vercel');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError('Select an image before submitting.');
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!endpoint) {
      setError('Missing NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const trimmedProperty = property.trim();
    if (trimmedProperty) {
      formData.append('property', trimmedProperty);
    }

    const trimmedSource = source.trim();
    if (trimmedSource) {
      formData.append('source', trimmedSource);
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let parsed: SubmissionResult = responseText;

      try {
        parsed = JSON.parse(responseText) as Record<string, unknown>;
      } catch {
        parsed = responseText;
      }

      if (!response.ok) {
        setError(`Request failed with status ${response.status}.`);
      }

      setResult(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedResult =
    result && typeof result === 'string'
      ? result
      : result
        ? JSON.stringify(result, null, 2)
        : '';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload ID Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="property">Property (optional)</Label>
                <Input
                  id="property"
                  placeholder="Property name"
                  value={property}
                  onChange={(event) => setProperty(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Send to n8n'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            {formattedResult ? (
              <pre className="whitespace-pre-wrap text-sm bg-muted rounded-md p-4">
                {formattedResult}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No response yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
