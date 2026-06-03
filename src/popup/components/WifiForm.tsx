import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type SecurityType = 'WPA' | 'WEP' | 'nopass';

interface WifiFormProps {
  onAssemble: (wifiString: string) => void;
}

// Escape characters reserved in the WIFI QR spec: \ ; , " :
const escapeWifi = (s: string) => s.replace(/[\\;,"':]/g, (c) => `\\${c}`);

export const WifiForm: React.FC<WifiFormProps> = ({ onAssemble }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState<SecurityType>('WPA');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!ssid.trim()) {
      onAssemble('');
      return;
    }
    const wifiStr =
      security === 'nopass'
        ? `WIFI:S:${escapeWifi(ssid)};T:nopass;;`
        : `WIFI:S:${escapeWifi(ssid)};T:${security};P:${escapeWifi(password)};;`;
    onAssemble(wifiStr);
  }, [ssid, password, security, onAssemble]);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* SSID */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-text/50">
          Network Name (SSID)
        </label>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          placeholder="MyHomeNetwork"
          className="w-full p-2.5 text-sm rounded-xl bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-text transition-all duration-200"
          autoFocus
        />
      </div>

      {/* Security type */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-text/50">
          Security
        </label>
        <div className="flex rounded-lg bg-surface border border-border p-0.5 select-none">
          {(['WPA', 'WEP', 'nopass'] as SecurityType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSecurity(type)}
              className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                security === type
                  ? 'bg-accent text-bg shadow-sm'
                  : 'text-text/60 hover:text-text'
              }`}
            >
              {type === 'nopass' ? 'None' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Password — hidden for open networks */}
      {security !== 'nopass' && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-text/50">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 pr-9 text-sm rounded-xl bg-surface border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-text transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
