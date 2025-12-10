import { useAuth } from '@/entities/user/model/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, ReactNode, JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaEnvelope, FaPhone, FaTelegramPlane, 
  FaArrowLeft
} from 'react-icons/fa';
import { faqItems } from '@/features/faq-accordion/model/faq-data';
import { FaqAccordion } from '@/features/faq-accordion/ui/FaqAccordion';
import { useScrollSpy } from '@/shared/lib/hooks/useScrollSpy';
import { SupportSidebar } from '@/widgets/support-sidebar/ui/SupportSidebar';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/Button';

const SectionWrapper = ({ id, title, children }: { id: string, title: string, children: ReactNode }) => (
  <section id={id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 scroll-mt-24">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
    <div className="text-slate-600">
      {children}
    </div>
  </section>
);

const ContactCard = ({ icon, title, text, href }: { icon: JSX.Element, title: string, text: string, href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="block p-6 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
    <div className="flex items-center gap-4">
      <div className="text-teal-500 text-2xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors">{text}</p>
      </div>
    </div>
  </a>
);

export const SupportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const sections = [
    { id: 'faq', label: t('support.sections.faq') },
    { id: 'contacts', label: t('support.sections.contacts') },
    { id: 'terms', label: t('support.sections.terms') },
    { id: 'privacy', label: t('support.sections.privacy') },
  ];

  const sectionIds = sections.map(s => s.id);
  const activeSectionId = useScrollSpy(sectionIds, { rootMargin: '-20% 0px -80% 0px' });
 
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold transition-colors"
        >
          <FaArrowLeft />
          {isAuthenticated ? t('support.backToDashboard') : t('support.backHome')}
        </button>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900">{t('support.title')}</h1>
        <p className="mt-3 text-lg text-slate-500">{t('support.subtitle')}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <SupportSidebar sections={sections} activeId={activeSectionId} />

        <div className="w-full lg:flex-1 space-y-8">
          <SectionWrapper id="faq" title={t('support.sections.faq')}>
            <FaqAccordion items={faqItems} />
          </SectionWrapper>

          <SectionWrapper id="contacts" title={t('support.sections.contacts')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ContactCard icon={<FaPhone />} title={t('support.contact.phone')} text="+996 704 020 784" href="tel:+996704020784" />
                <ContactCard icon={<FaTelegramPlane />} title={t('support.contact.telegram')} text="@wequit1" href="https://t.me/wequit1" />
                <ContactCard icon={<FaEnvelope />} title={t('support.contact.email')} text="adilhanimasev6@gmail.com" href="mailto:adilhanimasev6@gmail.com" />
              </div>

              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-4">{t('support.form.title')}</h4>
                <form className="space-y-4">
                  <Input type="email" placeholder={t('support.form.email')} required />
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={5}
                    placeholder={t('support.form.message')}
                    required
                  ></textarea>
                  <Button type="submit" className="w-full">{t('support.form.submit')}</Button>
                </form>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper id="terms" title={t('support.sections.terms')}>
            <p>{t('support.termsText')}</p>
          </SectionWrapper>

          <SectionWrapper id="privacy" title={t('support.sections.privacy')}>
            <p>{t('support.privacyText')}</p>
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
};
