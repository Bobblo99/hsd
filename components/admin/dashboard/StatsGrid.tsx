"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatItem {
  id: string;
  title: string;
  shortTitle?: string;
  value: number | string;
  subtitle?: string;
  shortSubtitle?: string;
  icon: ReactNode;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3", 
    4: "grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 md:gap-6`}>
      {stats.map((stat) => (
        <Card key={stat.id} className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
              <span className="hidden sm:inline">{stat.title}</span>
              <span className="sm:hidden">{stat.shortTitle || stat.title}</span>
            </CardTitle>
            <div className={`h-4 w-4 ${stat.color || 'text-red-500'}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <div className="text-xl md:text-2xl font-bold text-white">
              {stat.value}
            </div>
            {stat.subtitle && (
              <>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {stat.subtitle}
                </p>
                <p className="text-xs text-gray-400 sm:hidden">
                  {stat.shortSubtitle || stat.subtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}