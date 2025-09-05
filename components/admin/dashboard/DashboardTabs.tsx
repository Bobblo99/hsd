"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: ReactNode;
  content: ReactNode;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DashboardTabs({ tabs, activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full h-auto bg-gray-800 border-white/10" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-2 p-3 text-sm text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
            <span className="md:hidden">{tab.shortLabel || tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4 md:space-y-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}