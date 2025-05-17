'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, HardDrive, ChevronRight, Package as PackageBox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  const routes = [
    {
      label: 'Transcribe',
      icon: Mic,
      href: '/',
      active: pathname === '/',
    },
    {
      label: 'Storage',
      icon: HardDrive,
      href: '/storage',
      active: pathname === '/storage',
    },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center">
        {!isCollapsed && (
          <div className="flex items-center">
            <PackageBox className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">DeliverTalk</h1>
          </div>
        )}
        {isCollapsed && <PackageBox className="h-8 w-8 mx-auto" />}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full hover:bg-gray-100 ml-auto"
        >
          <ChevronRight className={cn(
            "h-5 w-5 transition-transform",
            isCollapsed ? "" : "rotate-180"
          )} />
        </button>
      </div>
      
      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-gray-500 text-sm font-medium p-3 hover:text-black hover:bg-gray-100 rounded-md transition-all",
                route.active && "text-black bg-gray-100"
              )}
            >
              <route.icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
              {!isCollapsed && <div>{route.label}</div>}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        {!isCollapsed && (
          <div>
            <h3 className="font-medium mb-2">About this app</h3>
            <p className="text-sm text-gray-500">
              DeliverTalk helps delivery personnel and customers communicate effectively by providing real-time voice transcription in Vietnamese.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}