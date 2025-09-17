// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { ChevronDown, Globe } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// const languages = [
//   {
//     code: 'uz',
//     name: 'O\'zbekcha',
//     flag: '🇺🇿',
//     nativeName: 'O\'zbekcha'
//   },
//   {
//     code: 'en',
//     name: 'English',
//     flag: '🇺🇸',
//     nativeName: 'English'
//   },
//   {
//     code: 'ru',
//     name: 'Русский',
//     flag: '🇷🇺',
//     nativeName: 'Русский'
//   }
// ];

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);

//   const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

//   const handleLanguageChange = (languageCode: string) => {
//     i18n.changeLanguage(languageCode);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative">
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
//       >
//         <span className="text-lg">{currentLanguage.flag}</span>
//         <span className="hidden sm:block font-medium text-gray-700">
//           {currentLanguage.nativeName}
//         </span>
//         <ChevronDown 
//           className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
//             isOpen ? 'rotate-180' : ''
//           }`} 
//         />
//       </Button>

//       {isOpen && (
//         <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//           {languages.map((language) => (
//             <button
//               key={language.code}
//               onClick={() => handleLanguageChange(language.code)}
//               className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
//                 i18n.language === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
//               }`}
//             >
//               <span className="text-lg">{language.flag}</span>
//               <div className="flex flex-col">
//                 <span className="font-medium text-sm">{language.nativeName}</span>
//                 <span className="text-xs text-gray-500">{language.name}</span>
//               </div>
//               {i18n.language === language.code && (
//                 <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Overlay to close dropdown when clicking outside */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-40" 
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher; 