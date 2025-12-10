import { Header } from "@/widgets/Header/ui/Header";
import AboutPhoto from "@/assets/images/about.svg";
import { useTranslation } from "react-i18next";


export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 text-slate-900">
      <Header />

      <main className="container mx-auto px-6 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2">
          <img
            src={AboutPhoto}
            alt="About VetCard"
            className="w-full max-w-lg mx-auto md:mx-0"
          />
        </div>

        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-8">
            {t ("aboutPage.aboutTheme")}
          </h1>

          <p className="text-lg md:text-xl mb-6 leading-relaxed">
          {t ("aboutPage.aboutText1")}         
           </p>

          <p className="text-lg md:text-xl mb-8 leading-relaxed">
          {t ("aboutPage.aboutText2")}         
          </p>


        
        </div>
      </main>




    </div>
  );
};