'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SettingsForm() {
  const [settings, setSettings] = useState({
    ga4Id: '',
    metaPixelId: '',
    additionalScripts: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          ga4Id: data.ga4Id || '',
          metaPixelId: data.metaPixelId || '',
          additionalScripts: data.additionalScripts || '',
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Google Analytics 4 Measurement ID"
            name="ga4Id"
            value={settings.ga4Id}
            onChange={(e) => setSettings({ ...settings, ga4Id: e.target.value })}
            placeholder="G-XXXXXXXXXX"
          />
          <Input
            label="Meta Pixel ID"
            name="metaPixelId"
            value={settings.metaPixelId}
            onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
            placeholder="123456789012345"
          />
          <Textarea
            label="Additional Scripts"
            name="additionalScripts"
            value={settings.additionalScripts}
            onChange={(e) => setSettings({ ...settings, additionalScripts: e.target.value })}
            rows={6}
            helperText="Paste any additional tracking scripts (e.g., Hotjar, Clarity)"
          />

          {success && (
            <div className="p-4 bg-green-50 text-green-800 rounded-md">
              Settings saved successfully!
            </div>
          )}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Test Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Test Email Address
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your-email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  if (!testEmail) {
                    alert('Please enter an email address');
                    return;
                  }

                  setTestEmailLoading(true);
                  setTestEmailResult('idle');

                  try {
                    const response = await fetch('/api/admin/test-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ to: testEmail }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                      setTestEmailResult('success');
                      setTestEmail('');
                    } else {
                      setTestEmailResult('error');
                      console.error('Test email error:', data.error);
                    }
                  } catch (error) {
                    setTestEmailResult('error');
                    console.error('Test email error:', error);
                  } finally {
                    setTestEmailLoading(false);
                  }
                }}
                disabled={testEmailLoading || !testEmail}
              >
                {testEmailLoading ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
          </div>

          {testEmailResult === 'success' && (
            <div className="p-4 bg-green-50 text-green-800 rounded-md">
              ✓ Test email sent successfully! Check your inbox.
            </div>
          )}

          {testEmailResult === 'error' && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              ✗ Failed to send test email. Check your email configuration and server logs.
            </div>
          )}

          <p className="text-sm text-text-secondary">
            Send a test email to verify your email configuration is working correctly.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

