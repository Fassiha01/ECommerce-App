import React from 'react';
import { DeviceOS } from '../types';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface DeviceFrameProps {
  deviceOS: DeviceOS;
  currentTime: string;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceOS,
  currentTime,
  children,
  onBack,
  showBack = false,
}) => {
  if (deviceOS === 'responsive') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white min-h-screen sm:min-h-[840px] sm:my-4 shadow-xl sm:rounded-3xl overflow-hidden sm:border sm:border-slate-200 flex flex-col relative">
        {children}
      </div>
    );
  }

  // iOS iPhone 16 Pro Frame
  if (deviceOS === 'ios') {
    return (
      <div className="relative mx-auto my-2 w-[390px] h-[830px] bg-black rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-slate-800 flex flex-col select-none">
        {/* Outer Titanium Bezel Highlights */}
        <div className="absolute inset-0 rounded-[52px] border-[2px] border-slate-700/40 pointer-events-none" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-slate-50 rounded-[44px] overflow-hidden flex flex-col shadow-inner">
          {/* iOS Status Bar & Dynamic Island */}
          <div className="w-full h-11 bg-white/90 backdrop-blur-md z-30 flex items-center justify-between px-7 shrink-0 text-xs font-semibold text-slate-900 select-none">
            {/* Time */}
            <span className="w-14 text-left font-semibold tracking-tight">{currentTime}</span>

            {/* Dynamic Island */}
            <div className="w-28 h-7 bg-black rounded-full flex items-center justify-between px-2.5 mx-auto transition-all duration-300 shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-blue-950/80 ring-1 ring-blue-500/20" />
            </div>

            {/* Status Icons */}
            <div className="w-14 flex items-center justify-end space-x-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-slate-50">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full h-6 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0 z-20">
            <div className="w-36 h-1.2 bg-slate-900 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Android Google Pixel 9 Pro Frame
  return (
    <div className="relative mx-auto my-2 w-[400px] h-[840px] bg-[#1a1c1e] rounded-[44px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-slate-800 flex flex-col select-none">
      {/* Outer Aluminum Frame Accent */}
      <div className="absolute inset-0 rounded-[44px] border-[2px] border-slate-700/40 pointer-events-none" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-slate-50 rounded-[36px] overflow-hidden flex flex-col shadow-inner">
        {/* Android Status Bar */}
        <div className="w-full h-9 bg-white/90 backdrop-blur-md z-30 flex items-center justify-between px-6 shrink-0 text-xs font-medium text-slate-800">
          <span className="font-bold tracking-normal">{currentTime}</span>

          {/* Center Punch-hole Camera */}
          <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-slate-900/50 shadow-inner" />

          {/* Status indicators */}
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="text-[10px] font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-slate-700" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-slate-50">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="w-full h-5 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0 z-20">
          <div className="w-20 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
