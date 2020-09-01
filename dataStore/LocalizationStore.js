import { action, computed, observable } from 'mobx';

export default class LocalizationStore {
  @observable language = null;
  @observable localizationBundle = null;
  @observable textAlignment = null;

  @action setLocalizationData({
    language,
    localizationBundle,
    textAlignment = 'text-left'
  }) {
    this.language = language;
    this.localizationBundle = localizationBundle;
    this.textAlignment = textAlignment;
  }

  getLocalizationData() {
    return {
      language: this.language,
      localizationBundle: this.localizationBundle,
      textAlignment: this.textAlignment
    };
  }

  getLanguage() {
    return this.language;
  }

  getLocalizationBundle() {
    return JSON.parse(this.localizationBundle);
  }

  getTextAlignment() {
    return this.textAlignment;
  }
}
