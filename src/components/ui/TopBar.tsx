import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, MapPin, Plus, User as UserIcon, ShieldCheck, QrCode } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    currentUser, 
    organization, 
    notifications, 
    setActiveTab, 
    setGiveModalOpen, 
    setAuthModalOpen,
    markNotificationRead 
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Campus Pill */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-emerald-700 transition-colors">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                SPARE
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                by Synliv
              </span>
            </div>
          </button>

          {/* Campus Location Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full border border-stone-200 text-xs text-stone-700 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[180px]">{organization.name}</span>
            <span className="text-[10px] text-stone-400 font-normal">({currentUser.department || 'Campus'})</span>
          </div>
        </div>

        {/* Actions (Desktop Give CTA, Notifications, Join QR, Profile) */}
        <div className="flex items-center gap-2.5">
          
          {/* Join Campus QR button */}
          <button
            onClick={() => setActiveTab('join')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-700 bg-stone-100 hover:bg-emerald-50 rounded-lg border border-stone-200 hover:border-emerald-200 transition-all"
            title="Campus QR Code & Posters"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus QR</span>
          </button>

          {/* Prominent Desktop "Give Something" CTA */}
          <button
            onClick={() => setGiveModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Give something</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-stone-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Notifications</h4>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setActiveTab('activity');
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3.5 hover:bg-stone-50 cursor-pointer transition-colors ${!n.read ? 'bg-emerald-50/40' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-stone-900">{n.title}</p>
                          <span className="text-[10px] text-stone-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 hover:bg-stone-100 rounded-full transition-colors group"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-600/30 group-hover:ring-emerald-600 transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
