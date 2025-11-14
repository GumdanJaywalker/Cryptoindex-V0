"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  indexName: string;
  setIndexName: (value: string) => void;
  ticker: string;
  setTicker: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  socialLink: string;
  setSocialLink: (value: string) => void;
}

export function BasicInfoStep({
  indexName,
  setIndexName,
  ticker,
  setTicker,
  description,
  setDescription,
  socialLink,
  setSocialLink,
}: BasicInfoStepProps) {
  const [touched, setTouched] = useState({
    indexName: false,
    ticker: false,
    description: false,
    socialLink: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Basics</h3>
      <div className="space-y-3">
        <div>
          <div className="text-slate-400 mb-1 text-sm">
            Index Name <span className="text-red-400">*</span>
          </div>
          <Input
            placeholder="Enter index name (min 3 chars)"
            value={indexName}
            onChange={(e) => setIndexName(e.target.value)}
            onBlur={() => handleBlur('indexName')}
            className={cn(
              "bg-teal-card border-teal text-white",
              touched.indexName && indexName && indexName.trim().length < 3 && "border-red-400"
            )}
          />
          {touched.indexName && indexName && indexName.trim().length < 3 && (
            <div className="text-red-400 text-xs mt-1">Name must be at least 3 characters</div>
          )}
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">
            Ticker <span className="text-red-400">*</span>
          </div>
          <Input
            placeholder="e.g., MYIDX (3-8 chars, A-Z 0-9 -)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onBlur={() => handleBlur('ticker')}
            maxLength={8}
            className={cn(
              "bg-teal-card border-teal text-white",
              touched.ticker && ticker && (ticker.trim().length < 3 || !/^[A-Z0-9-]+$/.test(ticker)) && "border-red-400"
            )}
          />
          {touched.ticker && ticker && ticker.trim().length < 3 && (
            <div className="text-red-400 text-xs mt-1">Ticker must be at least 3 characters</div>
          )}
          {touched.ticker && ticker && ticker.trim().length >= 3 && !/^[A-Z0-9-]+$/.test(ticker) && (
            <div className="text-red-400 text-xs mt-1">Only alphanumeric characters and dashes allowed</div>
          )}
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">
            Description <span className="text-red-400">*</span>
          </div>
          <textarea
            rows={3}
            placeholder="Describe your index (min 10 chars)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            className={cn(
              "w-full px-3 py-2 bg-teal-card border border-teal rounded-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-brand",
              touched.description && description && description.trim().length < 10 && "border-red-400"
            )}
          />
          {touched.description && description && description.trim().length < 10 && (
            <div className="text-red-400 text-xs mt-1">Description must be at least 10 characters</div>
          )}
        </div>
        <div>
          <div className="text-slate-400 mb-1 text-sm">Social Link (Optional)</div>
          <Input
            placeholder="https://"
            type="url"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="bg-teal-card border-teal text-white"
          />
        </div>
      </div>
    </div>
  );
}
