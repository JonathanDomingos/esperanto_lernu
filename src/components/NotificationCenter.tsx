import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, X, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onClearAll, 
  isOpen, 
  onClose 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed top-24 right-8 w-80 md:w-96 bg-white rounded-[32px] shadow-2xl z-[70] overflow-hidden border border-slate-100"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell size={20} className="text-slate-900" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Notificações</h3>
              </div>
              <button onClick={onClearAll} className="text-[10px] bento-label hover:text-emerald-600 transition-colors">
                Limpar tudo
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="py-20 text-center">
                  <BellOff size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 text-sm font-medium">Você está em dia!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layoutProps={{}}
                    className={`p-4 rounded-2xl border transition-all ${
                      notification.read ? 'bg-white border-slate-100 opacity-60' : 'bg-slate-50 border-emerald-100 shadow-sm'
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <div className={`mt-1 ${
                        notification.type === 'success' ? 'text-emerald-500' :
                        notification.type === 'warning' ? 'text-orange-500' :
                        'text-blue-500'
                      }`}>
                        {notification.type === 'success' ? <CheckCircle2 size={18} /> :
                         notification.type === 'warning' ? <AlertTriangle size={18} /> :
                         <Info size={18} />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
                          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
