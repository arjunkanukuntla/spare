import React from 'react';
import { Exchange } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, MapPin, CheckCircle2, ShieldAlert, Phone, UserCheck, Sparkles } from 'lucide-react';

interface ExchangeDetailModalProps {
  exchange: Exchange | null;
  onClose: () => void;
}

export const ExchangeDetailModal: React.FC<ExchangeDetailModalProps> = ({ exchange, onClose }) => {
  const { currentUser, confirmHandover } = useApp();

  if (!exchange) return null;

  const isGiver = currentUser.id === exchange.giverId;
  const isReceiver = currentUser.id === exchange.receiverId;
  const hasMyConfirmation = isGiver ? exchange.giverConfirmed : exchange.receiverConfirmed;
  const isCompleted = exchange.status === 'completed';

  const otherPersonName = isGiver ? exchange.receiverName : exchange.giverName;
  const otherPersonAvatar = isGiver ? exchange.receiverAvatar : exchange.giverAvatar;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Active Exchange Connection
            </span>
            <h2 className="font-bold text-stone-900 text-base mt-1">{exchange.listingTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Connection Banner */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <img
                src={otherPersonAvatar}
                alt={otherPersonName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-600/30"
              />
              <div>
                <p className="text-xs text-emerald-800 font-medium">You're connected with</p>
                <h3 className="font-bold text-stone-900 text-sm">{otherPersonName}</h3>
                <span className="text-[11px] text-emerald-700">{isGiver ? 'Receiver' : 'Giver'}</span>
              </div>
            </div>
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Agreed Pickup Spot */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-stone-700 font-bold">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Agreed Pickup Area</span>
            </div>
            <p className="text-stone-900 font-semibold text-sm pl-5">
              {exchange.pickupArea}
            </p>
            <p className="text-[11px] text-stone-400 pl-5">
              Meet at this public campus location to hand over the item.
            </p>
          </div>

          {/* Handover Status Boxes */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-700">Handover Confirmation Status:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                exchange.giverConfirmed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}>
                <span>Giver ({exchange.giverName.split(' ')[0]})</span>
                {exchange.giverConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="text-[10px]">Pending</span>}
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                exchange.receiverConfirmed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}>
                <span>Receiver ({exchange.receiverName.split(' ')[0]})</span>
                {exchange.receiverConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="text-[10px]">Pending</span>}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Close
          </button>

          {!isCompleted && (
            <button
              onClick={() => confirmHandover(exchange.id)}
              disabled={hasMyConfirmation}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                hasMyConfirmation
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
              }`}
            >
              {hasMyConfirmation ? 'Waiting for Other Side...' : 'Mark as Handed Over'}
            </button>
          )}

          {isCompleted && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
              Exchange Completed! 🎉
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
