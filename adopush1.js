function guid() {
    function _p8(s) {
      var p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }
    const guid = _p8() + _p8(true) + _p8(true) + _p8();
    let CookieDate = new Date();
    CookieDate.setFullYear(CookieDate.getFullYear() + 10);
    document.cookie =
      'guid=' + guid + '; expires=' + CookieDate.toUTCString() + '; path=/;';
    return guid;
  }

  window.WonderPush = window.WonderPush || [];

  function checkCookieGuid() {
    var match = document.cookie.match(new RegExp('(^| )' + 'guid' + '=([^;]+)'));
    if (match) {
      return match[2];
    } else {
      return -1;
    }
  }

  const hitAPI = async (guid, type) => {
    let res = "couldn't send " + type;
    let url = '';
    let url2 = '';
    if (type === 'userid') {
      url = `https://p.ad0p.com/hit.gif?type=pushUserRegistrationAttempt&userID=${guid}`;
    } else if (type === 'offset') {
      const offset = new Date().getTimezoneOffset();
      const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const region = timezoneName.split('/')[0];

      url = `https://p.ad0p.com/hit.gif?type=pushUserRegistration&gmtOffset=${offset}&timeZoneName=${timezoneName}&countryName=${region}&userID=${guid}`;
    }
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      res = await response.json();
    } catch (err) {
      console.log(err);
    } finally {
      console.log(`sent ${type}`, res);
    }
  };

  window.addEventListener('WonderPushEvent', function (event) {
      console.log(event)
    if (event && event.detail && event.detail.type === 'subscription') {
      if (event.detail.state === 1) {
        hitAPI(checkCookieGuid(), 'userid');
        console.log('attempt');
      }
      if (event.detail.state === 2) {
        hitAPI(checkCookieGuid(), 'offset');
        console.log('agreed to recieve notifications');
      }
      if (event.detail.state === -3) {
        console.log('you denied to recieve notifications');
      }
    }
  });

  if (checkCookieGuid() === -1) {
    WonderPush.push([
      'init',
      {
        webKey:
          '5f38b676909138d34fc59cb6b03849db4ae39511a0e94ef06fda530b6ca5f3e0',
        userId: guid(),
      },
    ]);
  } else {
    WonderPush.push([
      'init',
      {
        webKey:
          '5f38b676909138d34fc59cb6b03849db4ae39511a0e94ef06fda530b6ca5f3e0',
        userId: checkCookieGuid(),
      },
    ]);
  }
