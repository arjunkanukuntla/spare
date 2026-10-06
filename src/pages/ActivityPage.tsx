import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Claim, Exchange, Listing } from '../types';
import { Check, X, Clock, MapPin, CheckCircle, AlertCircle, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { 
    currentUser, 
    claims, 
    exchanges, 
    listings, 
    requests, 
    acceptClaim, 
    declineClaim, 
    setActiveExchangeForModal 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'claims' | 'given' | 'requests' | 'exchanges'>('claims');

  // Filter items relevant to current user
  const myClaims = claims.filter(c => c.claimantId === currentUser.id);
  const myGivenListings = listings.filter(l => l.ownerId === currentUser.id);
  const incomingClaims = claims.filter(c => c.ownerId === currentUser.id);
  const myRequests = requests.filter(r => r.requesterId === currentUser.id);
  const myExchanges = exchanges.filter(e => e.giverId === currentUser.id || e.receiverId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Activity & Exchanges</h1>
        <p className="text-xs text-stone-500">Track your claims, items given, requests, and active handovers</p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeSubTab === 'claims'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>My Claims</span>
          {myClaims.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/20 text-white rounded-full">
              {myClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('given')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeSubTab === 'given'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>Items Given ({myGivenListings.length})</span>
          {incomingClaims.filter(c => c.status === 'pending').length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-amber-500 text-white font-bold rounded-full">
              {incomingClaims.filter(c => c.status === 'pending').length} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>My Requests ({myRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exchanges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'exchanges'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <span>Exchanges ({myExchanges.length})</span>
        </button>
      </div>

      {/* Tab 1: Claims */}
      {activeSubTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-stone-200">
              <p className="font-bold text-stone-800 text-sm">No items claimed yet.</p>
              <p className="text-xs text-stone-500 mt-1">Explore nearby items to claim something you need!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myClaims.map((claim) => (
                <div key={claim.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={claim.listingImage || 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600'}
                      alt={claim.listingTitle}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{claim.listingCategory}</span>
                      <h4 className="font-bold text-stone-900 text-sm">{claim.listingTitle}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Giver: {claim.ownerName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                      claim.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      claim.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {claim.status}
                    </span>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Given (Manage incoming claims!) */}
      {activeSubTab === 'given' && (
        <div className="space-y-6">
          
          {/* Incoming Claim Requests */}
          {incomingClaims.filter(c => c.status === 'pending').length > 0 && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600" />
                <span>Pending Claims Needing Your Response</span>
              </h3>

              <div className="space-y-3">
                {incomingClaims.filter(c => c.status === 'pending').map((claim) => (
                  <div key={claim.id} className="p-4 bg-white rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={claim.claimantAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
                        alt={claim.claimantName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs">
                          {claim.claimantName} claimed "{claim.listingTitle}"
                        </h4>
                        {claim.message && (
                          <p className="text-xs text-stone-600 italic mt-0.5">
                            "{claim.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => declineClaim(claim.id)}
                        className="flex-1 sm:flex-none py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptClaim(claim.id)}
                        className="flex-1 sm:flex-none py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                      >
                        Accept Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Given Listings */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">Your Listings</h3>
            {myGivenListings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
                <p className="font-bold text-stone-700 text-sm">No items listed yet.</p>
              </div>
            ) : (
              myGivenListings.map((listing) => (
                <div key={listing.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{listing.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Pickup: {listing.pickupArea}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    listing.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Tab 3: Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <p className="font-bold text-stone-700 text-sm">No requests posted yet.</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div key={req.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{req.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Urgency: {req.urgency} • Location: {req.location}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-stone-100 text-stone-700 rounded-lg">
                  {req.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Active Exchanges */}
      {activeSubTab === 'exchanges' && (
        <div className="space-y-3">
          {myExchanges.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <p className="font-bold text-stone-700 text-sm">No active exchanges.</p>
            </div>
          ) : (
            myExchanges.map((exch) => (
              <div
                key={exch.id}
                onClick={() => setActiveExchangeForModal(exch)}
                className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={exch.listingImage || 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e488?auto=format&fit=crop&q=80&w=600'}
                    alt={exch.listingTitle}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs">{exch.listingTitle}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Pickup: {exch.pickupArea}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    exch.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {exch.status}
                  </span>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">Tap to View Details</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
