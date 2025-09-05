"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function DashboardCard({ 
  title, 
  description, 
  children, 
  className = "",
  actions 
}: DashboardCardProps) {
  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader className={actions ? "flex flex-row items-center justify-between space-y-0 pb-4" : ""}>
        <div>
          <CardTitle className="text-lg md:text-xl text-white">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-gray-400">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        {children}
      </CardContent>
    </Card>
  );
}