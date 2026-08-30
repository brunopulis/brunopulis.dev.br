const pt = require('./i18n/pt.json');
const en = require('./i18n/en.json');

// Mapeia nomes de ícones usados no i18n (herdados do lucide) para classes do Font Awesome 7.
const FA_ICONS = {
  'fast-forward': 'fa-forward',
  'file-text': 'fa-file-lines',
  'book-open': 'fa-book-open',
  users: 'fa-users',
  presentation: 'fa-presentation-screen',
  'shield-check': 'fa-shield-halved',
  'arrow-right': 'fa-arrow-right'
};

function faIcon(name) {
  return FA_ICONS[name] || 'fa-circle';
}

function i18n(key, locale) {
  const data = locale === 'en' ? en : pt;
  return key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), data) ?? key;
}

module.exports = { FA_ICONS, faIcon, i18n, pt, en };
