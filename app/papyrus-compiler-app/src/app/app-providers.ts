import { PreferencesService } from './preferences.service';

export const APP_PREFERENCES_SESSION = 'APP_PREFERENCES_SESSION';
export const APP_PREFERENCES_LOCAL = 'APP_PREFERENCES_LOCAL';

export const createSession = () => {
  return new PreferencesService(sessionStorage);
};

export const createLocal = () => {
  return new PreferencesService(localStorage);
};
