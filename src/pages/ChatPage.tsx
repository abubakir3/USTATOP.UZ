import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Conversation, ChatMessage } from '../types';
import {
  Search,
  Send,
  ImagePlus,
  Paperclip,
  Check,
  CheckCheck,
  Smile,
  X,
  Phone,
  ArrowLeft,
  Circle,
  Clock,
} from 'lucide-react';

interface ChatPageProps {
  initialConversationId?: string;
  onBack?: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  initialConversationId,
  onBack,
}) => {
  const {
    currentUser,
    conversations,
    messages,
    sendMessage,
    markConversationAsRead,
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string | null>(
    initialConversationId || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [attachmentImage, setAttachmentImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User's relevant conversations
  const myConversations = conversations.filter(
    (c) =>
      currentUser &&
      (c.customerId === currentUser.id ||
        c.masterId === currentUser.id ||
        c.participants.includes(currentUser.id))
  );

  // Filtered by search
  const filteredConversations = myConversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const otherName = currentUser?.id === c.masterId ? c.customerName : c.masterName;
    return otherName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
  });

  // Default select first conversation if none selected
  useEffect(() => {
    if (!activeConvId && myConversations.length > 0) {
      setActiveConvId(myConversations[0].id);
    }
  }, [myConversations, activeConvId]);

  // Mark active conversation as read
  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
    }
  }, [activeConvId, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Active messages
  const activeMessages = messages.filter((m) => m.conversationId === activeConvId);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConvId || (!inputText.trim() && !attachmentImage)) return;

    sendMessage(activeConvId, inputText.trim(), attachmentImage || undefined);
    setInputText('');
    setAttachmentImage(null);
    setShowImagePicker(false);
  };

  const sampleAttachments = [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
  ];

  const quickPhrases = [
    'Assalomu alaykum!',
    'Ertaga soat nechida qulay bo‘ladi?',
    'Manzilni yubordim.',
    'Ish uchun qancha vaqt ketadi?',
  ];

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Chatdan foydalanish uchun tizimga kiring</h3>
        <p className="text-xs text-slate-500">Usta va mijozlar o‘zaro xabar almashishi mumkin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] max-h-[750px]">
        {/* Left Sidebar: Conversations List */}
        <div
          className={`md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50 ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900">Suhbatlar</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suhbatlarni qidirish..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Hozircha chatlaringiz yo‘q.</p>
                <p className="text-[11px] text-slate-400">
                  Usta profilidagi "Xabar yozish" tugmasi orqali yangi suhbat boshlang.
                </p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isMaster = currentUser.id === c.masterId;
                const otherName = isMaster ? c.customerName : c.masterName;
                const otherAvatar = isMaster ? c.customerAvatar : c.masterAvatar;
                const otherRole = isMaster ? 'Mijoz' : c.masterProfession;
                const unread = isMaster ? c.unreadCountForMaster : c.unreadCountForCustomer;
                const isSelected = c.id === activeConvId;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 border-r-4 border-blue-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          otherAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={otherName}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {otherName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(c.updatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-blue-600 truncate mb-1">
                        {otherRole}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500 truncate leading-snug">
                          {c.lastMessage}
                        </p>
                        {unread > 0 && (
                          <span className="shrink-0 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div
          className={`md:col-span-8 flex flex-col h-full bg-white ${
            !activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              {(() => {
                const isMaster = currentUser.id === activeConversation.masterId;
                const otherName = isMaster
                  ? activeConversation.customerName
                  : activeConversation.masterName;
                const otherAvatar = isMaster
                  ? activeConversation.customerAvatar
                  : activeConversation.masterAvatar;
                const otherRole = isMaster ? 'Mijoz' : activeConversation.masterProfession;

                return (
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveConvId(null)}
                        className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg mr-1"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative">
                        <img
                          src={otherAvatar}
                          alt={otherName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          {otherName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-medium text-blue-600">{otherRole}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Tarmoqda
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                {activeMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-3.5 shadow-sm space-y-2 text-xs sm:text-sm ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {msg.attachmentUrl && (
                          <div className="rounded-xl overflow-hidden mb-2 max-h-48 border border-white/20">
                            <img
                              src={msg.attachmentUrl}
                              alt="biriktirilgan surat"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] ${
                            isMine ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick phrases bar */}
              <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">
                  Tezkor:
                </span>
                {quickPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(phrase)}
                    className="shrink-0 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              {/* Image attachment preview */}
              {attachmentImage && (
                <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={attachmentImage}
                      alt="attachment preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                    />
                    <span className="text-xs text-slate-600">Surat biriktirildi</span>
                  </div>
                  <button
                    onClick={() => setAttachmentImage(null)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Attachment Picker Popover */}
              {showImagePicker && (
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Surat tanlang:</span>
                  <div className="flex gap-2">
                    {sampleAttachments.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="namuna"
                        onClick={() => {
                          setAttachmentImage(img);
                          setShowImagePicker(false);
                        }}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 cursor-pointer hover:ring-2 hover:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setShowImagePicker(!showImagePicker)}
                  className={`p-2.5 rounded-xl border border-slate-200 transition-colors ${
                    showImagePicker ? 'bg-blue-50 text-blue-600 border-blue-300' : 'text-slate-500 hover:text-blue-600'
                  }`}
                  title="Rasm biriktirish"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Xabar yozing..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !attachmentImage}
                  className="p-2.5 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Yuborish</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">Suhbatni tanlang</h3>
              <p className="text-xs max-w-xs">
                Muloqot qilish uchun chap tomondagi ro‘yxatdan suhbatni tanlang.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
