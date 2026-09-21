import React, { useState } from 'react';
import { Claim, ChatMessage } from '../types';
import { useApp } from '../context/AppContext';
import { X, Send, Lock } from 'lucide-react';

interface ChatModalProps {
  claim: Claim | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ claim, onClose }) => {
  const { currentUser } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      claimId: claim?.id || '1',
      senderId: 'provider',
      senderName: claim?.providerName || 'Provider',
      text: 'Hi! Your claim is confirmed. Items are packed at the main entrance desk.',
      timestamp: '10:15 AM',
    },
    {
      id: 'm2',
      claimId: claim?.id || '1',
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: 'Great! I will be arriving in 10 minutes with green auto.',
      timestamp: '10:18 AM',
    },
  ]);

  const [input, setInput] = useState('');

  if (!claim) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      claimId: claim.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: input,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col h-[500px] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <span>{claim.listingTitle}</span>
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium">Chat with {claim.providerName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="bg-emerald-50 text-emerald-900 text-[11px] px-3 py-1.5 font-semibold flex items-center gap-1 border-b border-emerald-100">
          <Lock className="w-3.5 h-3.5 text-emerald-700" /> Private in-app chat (phone numbers stay hidden).
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                }`}>
                  <p className="font-semibold">{m.text}</p>
                  <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
