import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Star, PackageCheck, Heart, User, MapPin, Building2, RefreshCw } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, users, organization } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        {/* Avatar */}
        <div className="relative">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-600/20"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-stone-900">{currentUser.name}</h1>
              <p className="text-xs text-stone-500">{currentUser.email}</p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold mx-auto sm:mx-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              <span>{currentUser.reliabilityRating || 5.0} Reliability Score</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-600">
            <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{organization.name}</span>
            </span>
            {currentUser.department && (
              <span className="bg-stone-100 px-2.5 py-1 rounded-lg">
                {currentUser.department} ({currentUser.year || 'Student'})
              </span>
            )}
            <span className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentUser.approximateLocation}</span>
            </span>
          </div>

          {currentUser.bio && (
            <p className="text-xs text-stone-600 pt-2 italic">
              "{currentUser.bio}"
            </p>
          )}
        </div>

      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center shadow-xs">
          <p className="text-xl font-extrabold text-emerald-700">{currentUser.itemsGiven || 0}</p>
          <p className="text-[11px] text-stone-500 font-medium mt-0.5">Items Given</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center shadow-xs">
          <p className="text-xl font-extrabold text-stone-900">{currentUser.itemsClaimed || 0}</p>
          <p className="text-[11px] text-stone-500 font-medium mt-0.5">Items Claimed</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center shadow-xs">
          <p className="text-xl font-extrabold text-emerald-700">{currentUser.completedExchanges || 0}</p>
          <p className="text-[11px] text-stone-500 font-medium mt-0.5">Completed Exchanges</p>
        </div>
      </div>

      {/* Switch User / Role Testing Section */}
      <div className="p-5 bg-stone-100/70 rounded-3xl border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-stone-900 text-sm">Switch User Account (Development & Testing)</h3>
          </div>
          <span className="text-[10px] text-stone-500">Test Give & Claim interactions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setCurrentUser(u)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                currentUser.id === u.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold">{u.name}</p>
                  <p className={`text-[10px] ${currentUser.id === u.id ? 'text-emerald-100' : 'text-stone-400'}`}>
                    {u.department ? `${u.department} ${u.year || ''}` : u.role}
                  </p>
                </div>
              </div>
              {currentUser.id === u.id && (
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
