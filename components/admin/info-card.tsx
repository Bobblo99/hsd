"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconColor?: string;
  copyable?: boolean;
  clickable?: boolean;
  href?: string;
  className?: string;
}

export function InfoCard({
  icon,
  label,
  value,
  iconColor = "text-gray-400",
  copyable = false,
  clickable = false,
  href,
  className = ""
}: InfoCardProps) {
  const copyToClipboard = () => {
    if (value) {
      navigator.clipboard.writeText(value);
    }
  };

  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <div className={`bg-white/5 rounded-lg p-3 border border-white/10 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={iconColor}>
          {icon}
        </div>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          {clickable && href ? (
            <button
              onClick={handleClick}
              className="text-sm text-white font-medium hover:text-red-400 transition-colors truncate block w-full text-left"
              title={value}
            >
              {value || "-"}
            </button>
          ) : (
            <p 
              className="text-sm text-white font-medium truncate" 
              title={value}
            >
              {value || "-"}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {copyable && value && (
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              title="Kopieren"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          
          {clickable && href && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClick}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              title="Öffnen"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}