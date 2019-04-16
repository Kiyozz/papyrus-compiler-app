import { LocalPreferences, PreferencesService, SessionPreferences } from './services/preferences.service';

export const APP_PREFERENCES_SESSION = 'APP_PREFERENCES_SESSION';
export const APP_PREFERENCES_LOCAL = 'APP_PREFERENCES_LOCAL';

export const createSession = () => {
  return new PreferencesService<SessionPreferences>(sessionStorage, {
    group: null
  });
};

export const createLocal = () => {
  return new PreferencesService<LocalPreferences>(localStorage, {
    flag: '',
    gamePathFolder: '',
    outputFolder: '',
    importsFolder: '',
    groups: []
  });
};
