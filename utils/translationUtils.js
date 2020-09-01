import { LocalizationConsumer } from 'react-localize';
import en_localization from '../translations/en';
import te_localization from '../translations/te';
import ur_localization from '../translations/ur';

export function getTranslatedText(string) {
  return (
    <LocalizationConsumer>
      {({ localize }) => {
        return localize(string);
      }}
    </LocalizationConsumer>
  );
}

export function getLocalizationBundleForLanguage(language) {
  if (language === 'te') {
    return te_localization;
  } else if (language === 'ur') {
    return ur_localization;
  } else {
    return en_localization;
  }
}

export function getTextAlignmentForLanguage(language) {
  if (language == 'ur') {
    return 'text-right';
  } else {
    return 'text-left';
  }
}

export function validateSelectedLanguage(language) {
  if (language != 'ur' && language != 'te') return 'en';
  return language;
}
