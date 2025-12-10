import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { Message } from '../model/types';
import { Logo } from '@/shared/ui/Logo';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';

  const bubbleClasses = isUser
    ? 'bg-slate-800 text-white'
    : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';

  const layoutClasses = isUser ? 'justify-end' : 'justify-start';

  const userAvatar = (
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
      <FaUser className="w-4 h-4 text-slate-500" />
    </div>
  );

  const aiAvatar = (
    <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        <Logo />
    </div>
  );

  return (
    <motion.div
      className={`flex items-start gap-2 sm:gap-3 w-full ${layoutClasses}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {!isUser && aiAvatar}
      <div className={`max-w-xl w-fit rounded-xl px-4 py-3 ${bubbleClasses} break-words`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
      {isUser && userAvatar}
    </motion.div>
  );
});