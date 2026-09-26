"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeForClassification = exports.detectLanguage = exports.getLanguageName = exports.supportedLanguages = void 0;
exports.supportedLanguages = ['en', 'hi', 'mr', 'es'];
const languageNames = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    es: 'Spanish',
};
const getLanguageName = (language) => languageNames[language] || languageNames.en;
exports.getLanguageName = getLanguageName;
const detectLanguage = (text, preferredLanguage = 'en') => {
    if (/[\u0900-\u097F]/.test(text)) {
        if (/(मला|मंजुरी|विनंती|वसूल|चलन|रजा|कर्मचारी)/.test(text))
            return 'mr';
        return 'hi';
    }
    if (/(factura|pago|atrasado|solicitud|licencia|empleado|descuento|aprobación)/i.test(text))
        return 'es';
    return preferredLanguage;
};
exports.detectLanguage = detectLanguage;
const normalizeForClassification = (text, language) => {
    const normalized = text.toLowerCase();
    const aliases = {
        en: [],
        hi: [
            ['चालान', 'invoice'], ['भुगतान', 'payment'], ['वसूल', 'recover'], ['लंबित', 'overdue'],
            ['छुट्टी', 'leave'], ['खरीद', 'purchase'], ['कुर्सी', 'chair'], ['प्रतिपूर्ति', 'reimburse'],
            ['यात्रा', 'trip'], ['ग्राहक', 'customer'], ['लैपटॉप', 'laptop'], ['कर्मचारी', 'employee'],
            ['यात्रा', 'onboarding'], ['छूट', 'discount'], ['विक्रेता', 'vendor'], ['नेटवर्क', 'network'],
        ],
        mr: [
            ['चलन', 'invoice'], ['पेमेंट', 'payment'], ['वसूल', 'recover'], ['थकीत', 'overdue'],
            ['रजा', 'leave'], ['खरेदी', 'purchase'], ['खुर्च्या', 'chair'], ['परतावा', 'reimburse'],
            ['प्रवास', 'trip'], ['ग्राहक', 'customer'], ['लॅपटॉप', 'laptop'], ['कर्मचारी', 'employee'],
            ['मंजुरी', 'approval'], ['सवलत', 'discount'], ['विक्रेता', 'vendor'], ['नेटवर्क', 'network'],
        ],
        es: [
            ['factura', 'invoice'], ['pago', 'payment'], ['recuperar', 'recover'], ['atrasado', 'overdue'],
            ['vacaciones', 'leave'], ['comprar', 'purchase'], ['sillas', 'chair'], ['reembolso', 'reimburse'],
            ['viaje', 'trip'], ['cliente', 'customer'], ['portátil', 'laptop'], ['empleado', 'employee'],
            ['descuento', 'discount'], ['proveedor', 'vendor'], ['red', 'network'],
        ],
    };
    return aliases[language].reduce((result, [from, to]) => result.replaceAll(from, to), normalized);
};
exports.normalizeForClassification = normalizeForClassification;
