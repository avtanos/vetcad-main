import { Header } from "@/widgets/Header/ui/Header";
import PetIllustration from "@/assets/images/Veterinary-bro.png";
import AboutPhoto from "@/assets/images/farm_animals-rafiki.svg";
import { Button } from "@/shared/ui/Button";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

export const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-teal-50 text-slate-900">
      <Header />

      <main className="overflow-hidden">
        <section className="container mx-auto px-6 py-16 sm:py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              <Trans
                i18nKey="mainPage.mainTheme"
                components={{ 1: <span className="text-teal-600" /> }}
              />
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto md:mx-0">
              {t ("mainPage.mainText1")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap justify-center md:justify-start gap-4">
              <Button
                to="/register"
                variant="primary"
                className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
              >
                {t ("mainPage.button1")}
              </Button>
              <Button
                to="/about"
                variant="outline"
                className="w-full sm:w-auto border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg"
              >
              {t ("mainPage.button2")}
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <img
              src={PetIllustration}
              alt="Pet care illustration"
              className="w-full max-w-sm sm:max-w-md mx-auto drop-shadow-xl"
            />
            <div className="hidden sm:block absolute -z-10 top-[-80px] right-[-100px] w-[300px] h-[300px] bg-teal-100 rounded-full blur-3xl opacity-30"></div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t ("mainPage.opportunity")}
            </h2>
            <p className="text-slate-500 text-base sm:text-lg mb-10 sm:mb-12">
             {t ("mainPage.opportunity_text")}
            </p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <Feature icon="🩺" title={t("mainPage.title1")}>
                {t ("mainPage.opportunity_card1")}
              </Feature>
              <Feature icon="⏰" title={t("mainPage.title2")}>
              {t ("mainPage.opportunity_card2")}              
              </Feature>
              <Feature icon="🤖" title={t("mainPage.title3")}>
              {t ("mainPage.opportunity_card3")}              
              </Feature>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-[#FBFCFE]">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                {t ("mainPage.mainText2")}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t ("mainPage.mainText3")}
              </p>
            </div>

            <div className="md:w-1/2">
              <img
                src={AboutPhoto}
                alt="Farm animals"
                className="w-full max-w-md sm:max-w-lg mx-auto"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: string;
}) => (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-lg p-6 text-center transition hover:scale-105 hover:shadow-xl">
    <div className="text-4xl sm:text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <p className="mt-2 text-slate-600">{children}</p>
  </div>
);
