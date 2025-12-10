import errorImg from '@/assets/images/404error-amico.svg';

export const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center">
    <img src={errorImg} alt="404 Error" className="w-80 h-auto mb-6" />
    <h1 className="text-3xl font-bold">404 Not Found</h1>
    <p>К сожалению, неправильно набран адрес, или  такой страницы на сайте не существует</p>
  </div>
);

