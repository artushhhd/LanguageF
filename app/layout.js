"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Локальный словарь для элементов интерфейса макета
const translations = {
  ru: {
    home: "Главная", products: "Товары", like: "Избранное",
    addProduct: "Добавить товар", settings: "Настройки",
    account: "Личный кабинет", login: "Войти", register: "Регистрация",
    rights: "Все права защищены."
  },
  en: {
    home: "Home", products: "Products", like: "Like",
    addProduct: "Add Product", settings: "Settings",
    account: "Account", login: "Login", register: "Register",
    rights: "All rights reserved."
  },
  am: {
    home: "Գլխավոր", products: "Ապրանքներ", like: "Հավանածներ",
    addProduct: "Ավելացնել", settings: "Կարգավորումներ",
    account: "Անձնական էջ", login: "Մուտք", register: "Գրանցում",
    rights: "Բոլոր իրավունքները պաշտպանված են:"
  }
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Язык по умолчанию — ru. База данных перезапишет его, если есть дефолт в таблице
  const [lang, setLang] = useState("ru");
  const [dbLanguages, setDbLanguages] = useState([]);

  useEffect(() => {
    // 1. Сначала проверяем, выбирал ли пользователь язык ранее
    const savedLang = localStorage.getItem("site_lang");
    if (savedLang) {
      setLang(savedLang);
    }

    // 2. Стучимся к роуту, который мы только что прописали в Laravel api.php
    fetch("http://localhost:8000/api/languages")
      .then((res) => res.json())
      .then((data) => {
        setDbLanguages(data);
        
        // Если пользователь зашел впервые и в LocalStorage пусто — берём дефолтный язык из БД
        if (!savedLang && data.length > 0) {
          const defaultLang = data.find(l => l.is_default);
          if (defaultLang) {
            setLang(defaultLang.code);
          }
        }
      })
      .catch((err) => console.error("Не удалось загрузить языки с бэкенда:", err));
  }, []);

  // Функция для изменения языка и сохранения в браузере
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("site_lang", newLang);
  };

  const t = translations[lang] || translations["ru"];
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html lang={lang}>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition">
                STORE<span className="text-blue-600">.</span>
              </Link>
              
              {/* Показываем навигацию, только если мы НЕ на страницах auth */}
              {!isAuthPage && (
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                  <Link href="/profile" className="hover:text-blue-600 transition-colors">{t.home}</Link>
                  <Link href="/product" className="hover:text-blue-600 transition-colors">{t.products}</Link>
                  <Link href="/like" className="hover:text-blue-600 transition-colors">{t.like}</Link>
                  <Link href="/addProduct" className="hover:text-blue-600 transition-colors">{t.addProduct}</Link>
                  <Link href="/admin" className="hover:text-blue-600 transition-colors">{t.settings}</Link>
                </nav>
              )}
            </div>

            <div className="flex items-center gap-6">
              
              {/* Блок переключателя языков из твоей БД */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                {dbLanguages.length > 0 ? (
                  dbLanguages.map((language) => (
                    <button 
                      key={language.code}
                      onClick={() => changeLanguage(language.code)} 
                      className={`px-2 py-1 rounded uppercase transition-all ${
                        lang === language.code 
                          ? "bg-white shadow text-blue-600" 
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                      title={language.name}
                    >
                      {language.code}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-400 px-2 py-1 animate-pulse">...</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                {isAuthPage ? (
                  <div className="flex gap-4 text-sm font-medium">
                    <Link 
                      href="/login" 
                      className={`transition-colors ${pathname === "/login" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                    >
                      {t.login}
                    </Link>
                    <Link 
                      href="/" 
                      className={`transition-colors ${pathname === "/register" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                    >
                      {t.register}
                    </Link>
                  </div>
                ) : (

                  <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all">
                    {t.account}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children} 
        </main>

        <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Store App. {t.rights}
        </footer>

      </body>
    </html>
  );
}