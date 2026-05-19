import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { strings, t as translate } from '../utils/languageStrings';

const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  const t = (key, vars = {}) => {
    return translate(key, language, vars);
  };

  return { t, language };
};

export default useTranslation;
