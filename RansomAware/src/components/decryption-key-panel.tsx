'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CORRECT_KEY = 'R$NS0M-W$R3-AWARE-D3CRYPT-K3Y';

export function DecryptionKeyPanel() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleValidate = () => {
    if (key.trim() === CORRECT_KEY) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <KeyRound />
          Decryption Key Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          If you have obtained a decryption key, enter it here to validate.
        </p>
        <div className="flex w-full items-center space-x-2">
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setStatus('idle');
            }}
            placeholder="Enter decryption key..."
          />
          <Button onClick={handleValidate}>Validate</Button>
        </div>
        {status === 'success' && (
          <Alert variant="default" className="border-green-500/50 text-green-700 [&>svg]:text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              The key is valid. Your files can be decrypted.
            </AlertDescription>
          </Alert>
        )}
        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Invalid key. The key does not match the signature.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
