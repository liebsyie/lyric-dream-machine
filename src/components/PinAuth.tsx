
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface PinAuthProps {
  onAuthenticated: () => void;
}

const PinAuth = ({ onAuthenticated }: PinAuthProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const isAuthenticated = localStorage.getItem('musicapp_authenticated');
    if (isAuthenticated === 'true') {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '119187100129') {
      localStorage.setItem('musicapp_authenticated', 'true');
      onAuthenticated();
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full music-gradient">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">AI Music Creator</CardTitle>
          <p className="text-muted-foreground">Enter your PIN to access the studio</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={12}
              />
              {error && (
                <p className="text-destructive text-sm mt-2 text-center">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full music-gradient hover:opacity-90">
              Access Studio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinAuth;
