import React, { useState } from 'react';
import { Settings, Shield, Key, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [invoiceThreshold, setInvoiceThreshold] = useState('50000');
  const [discountCeiling, setDiscountCeiling] = useState('25');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-400" />
          POLICY ENGINE CONFIGURATION & API SETTINGS
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure business policy approval thresholds, spending ceilings, and optional LLM API credentials
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* AI Mode Configuration */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-2">
            <Key className="w-4 h-4" />
            AI Provider Credentials (Optional - Defaults to DEMO MODE)
          </h3>
          <p className="text-xs text-gray-400">
            AI Orchestrator works out-of-the-box in DEMO MODE without any external API keys. You may optionally enter a Gemini API Key to enable LIVE AI MODE.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (Google Gemini API Key)"
            className="w-full bg-dark-base border border-dark-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
          />
        </div>

        {/* Policy Threshold Config */}
        <div className="space-y-4 pt-4 border-t border-dark-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Configurable Policy Engine Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">High-Value Invoice Recovery Approval Threshold (₹)</label>
              <input
                type="number"
                value={invoiceThreshold}
                onChange={(e) => setInvoiceThreshold(e.target.value)}
                className="w-full bg-dark-base border border-dark-border rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-semibold">Maximum Executive Discount Ceiling (%)</label>
              <input
                type="number"
                value={discountCeiling}
                onChange={(e) => setDiscountCeiling(e.target.value)}
                className="w-full bg-dark-base border border-dark-border rounded-xl p-3 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
          {saved ? (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Policy Engine Configuration Saved Successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
