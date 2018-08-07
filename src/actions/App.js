import store from 'store'
import moment from 'moment'
import keyMirror from '../utils/keyMirror'
import translations from '../../translations/translated-messages.json'
import { 
  addLocales,
  getLangFullName,
  getAvailableLanguages,
  setGlobalIntlProvider
} from '../utils/translationUtils'

export const AppConstants = keyMirror(
  {
    ON_MOBILE: null,
    WEB3_ACCOUNT: null,
    WEB3_INTENT: null,
    TRANSLATIONS: null,
  },
  'APP'
)

export function setMobile(device) {
  return { type: AppConstants.ON_MOBILE, device }
}

export function storeWeb3Account(address) {
  return { type: AppConstants.WEB3_ACCOUNT, address }
}

export function storeWeb3Intent(intent) {
  return { type: AppConstants.WEB3_INTENT, intent }
}

export function localizeApp() {
  let messages;
  let selectedLanguageAbbrev;

  // Add locale data to react-intl
  addLocales()

  // English is our default - to prevent errors, we set to undefined for English
  // https://github.com/yahoo/react-intl/issues/619#issuecomment-242765427
  // Check for a user-selected language from the dropdown menu (stored in local storage)
  const userSelectedLangAbbrev = store.get('preferredLang')

  if (userSelectedLangAbbrev) {

    selectedLanguageAbbrev = userSelectedLangAbbrev

    // English is our default - to prevent errors, we set to undefined for English
    if (selectedLanguageAbbrev !== 'en') {
      messages = translations[userSelectedLangAbbrev]
    }

  } else {

    // Detect user's preferred settings
    const detectedLanguage = (navigator.languages && navigator.languages[0]) ||
                             navigator.language ||
                             navigator.userLanguage

    // Split locales with a region code
    selectedLanguageAbbrev = detectedLanguage.toLowerCase().split(/[_-]+/)[0]

    if (selectedLanguageAbbrev !== 'en') {
      messages = translations[selectedLanguageAbbrev] || translations[detectedLanguage]
    }
  }

  setGlobalIntlProvider(selectedLanguageAbbrev, messages)

  // Set locale for moment.js
  if (selectedLanguageAbbrev !== 'en') {
    const momentLocale = selectedLanguageAbbrev === 'zh' ? 'zh-cn' : selectedLanguageAbbrev
    moment.locale(momentLocale)
  }

  return { 
    type: AppConstants.TRANSLATIONS,
    selectedLanguageAbbrev: selectedLanguageAbbrev,
    selectedLanguageFull: getLangFullName(selectedLanguageAbbrev),
    availableLanguages: getAvailableLanguages(),
    messages 
  }
}
