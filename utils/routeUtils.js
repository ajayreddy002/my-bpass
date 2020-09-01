import {
  getLocalizationBundleForLanguage,
  getTextAlignmentForLanguage,
  validateSelectedLanguage
} from './translationUtils';

export function getTranslationLocale(language, localizationMobxStore) {
  const existingLanguage = localizationMobxStore.getLanguage();
  let localizationBundle = localizationMobxStore.getLocalizationBundle();
  let textAlign = localizationMobxStore.getTextAlignment();
  if (existingLanguage != language) {
    language = validateSelectedLanguage(language);
    localizationBundle = getLocalizationBundleForLanguage(language);
    textAlign = getTextAlignmentForLanguage(language);
  }
  return {
    language,
    localizationBundle,
    textAlign
  };
}
