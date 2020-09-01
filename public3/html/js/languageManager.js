function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function setSelectedLanguage(language) {
  setCookie('language', language, 1);
}

function getSelectedLanguage() {
  return getCookie('language');
}

function setLanguageAndRedirect(language) {
  setSelectedLanguage(language);
  jQuery('#languageSelectionModal').modal('hide');
  redirectToLanguageHome(language);
}

function redirectToLanguageHome(language) {
  var url = '../' + language + '/index.html';
  if (window.location.pathname.includes(language)) {
    //Do nothing for redirection
  } else window.location.replace(url);
}
