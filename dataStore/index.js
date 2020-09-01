import ApplicationFormStore from './ApplicationFormStore';
import LocalizationStore from './LocalizationStore';
import { useStaticRendering } from 'mobx-react';
const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store = null;

export default function initializeStore(
  initialData = { applicationForm: {}, localization: {} }
) {
  if (isServer) {
    return {
      applicationForm: new ApplicationFormStore(initialData.applicationForm),
      localization: new LocalizationStore(initialData.localization)
    };
  }
  if (store === null) {
    store = {
      applicationForm: new ApplicationFormStore(initialData.applicationForm),
      localization: new LocalizationStore(initialData.localization)
    };
  }

  return store;
}
