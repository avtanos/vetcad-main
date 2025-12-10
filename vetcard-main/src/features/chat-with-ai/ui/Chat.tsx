import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { Message } from '@/entities/message/model/types';
import { MessageBubble } from '@/entities/message/ui/MessageBubble';
import { Logo } from '@/shared/ui/Logo';
import { useTranslation } from 'react-i18next';
import { api } from '@/shared/api';

const TypingIndicator = () => {
  const { t } = useTranslation();
  return <div className="text-slate-400 text-sm mt-2">{t("chat.typing")}</div>;
};

const WelcomeScreen = ({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) => {
  const { t } = useTranslation();
  const suggestions = t("chat.suggestions", { returnObjects: true }) as string[];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <Logo />

      <h2 className="mt-4 text-xl sm:text-2xl font-bold text-slate-800">
        {t("chat.title")}
      </h2>

      <p className="mt-2 text-sm sm:text-base text-slate-500">
        {t("chat.subtitle")}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestionClick(text)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Автоматическая прокрутка к последнему сообщению
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const accessToken = localStorage.getItem('authToken');
      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));

      const response = await api.post<{
        message: string;
        conversation_history?: Array<{ text: string; sender: string }>;
      }, {
        response: string;
        reminder_suggestion?: {
          event: string;
          pet_name: string;
        };
      }>(
        '/v1/ai/chat/',
        {
          message: text,
          conversation_history: conversationHistory
        },
        accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Если AI предложил создать напоминание, можно показать уведомление
      if (response.reminder_suggestion) {
        // Можно добавить логику для предложения создания напоминания
        console.log('AI предложил создать напоминание:', response.reminder_suggestion);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Извините, произошла ошибка: ${error.message || 'Не удалось получить ответ от AI'}`,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="bg-white  flex flex-col h-[90vh]">
      <div className="flex-1 p-6 space-y-6 overflow-y-auto flex flex-col h-full">
        <AnimatePresence>
          {messages.length === 0 && !isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <WelcomeScreen onSuggestionClick={handleSend} />
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
        </AnimatePresence>
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>



      <div className="p-2 sm:p-3 md:p-4 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex bg-slate-100 rounded-xl p-1.5 sm:p-2 items-center"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-transparent resize-none border-none outline-none focus:ring-0 text-sm sm:text-base text-slate-800 placeholder-slate-500 px-2 max-h-36 overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all disabled:bg-slate-300 flex-shrink-0"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
