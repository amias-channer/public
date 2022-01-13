/* eslint-disable */
/**
 * JavaScript nn.launch.module.keyInvest
 * Function to track Key Invest Project activities
 *
 * const lntrack = new nn.launch.module.KeyInvest('http://www.adobe.com'); TO BE CALLED IN THE REACT APP
 *
 * lntrack.lnclickTrack('one', 'two', 'three', 'four');
 * lntrack.lnpageloadTrack('unu', 'doi', 'trei', 'patru', 'cinci', 'sase', 'sapte');
 * lntrack.lnsearchTrack(true, 'two', 'three', 'four');
 * lntrack.lnsearchTrack(false, 'two', 'three', 'four');
 * lntrack.lnprodTrack('87987987', 'eventaction');
 *
 *
 */

window.nn = window.nn || {};
nn.launch = nn.launch || {};
nn.launch.module = nn.launch.module || {};

nn.launch.module.KeyInvest = function (path) {
  var self = this;
  return self.init(path);
}

nn.launch.module.KeyInvest.prototype = {
  constructor: nn.launch.module.KeyInvest,

  init: function (path) {
    this._initLaunch(path);
    this._create();

    return {
      lnpageloadTrack: this.pageloadTrack.bind(this),
      lnclickTrack: this.clickTrack.bind(this),
      lnsearchTrack: this.searchTrack.bind(this),
      lnprodTrack: this.productTrack.bind(this),
      lnddTrack: this.docDownloadTrack.bind(this),
      lncontentTrack: this.contentClickTrack.bind(this),
      lnformTrack: this.formTrack.bind(this)
    }
  },

  _create: function () {
    window.digitalData = window.digitalData || {
      'page': {},
      'event': [],
      'user': {}
    }
  },

  _initLaunch: function (src) {
    var self = this,
      script = document.createElement('script');

    if (src) {
      script.src = src;
      document.head.appendChild(script);

      script.onerror = function () {
        console.error('Launch library can not be loaded!');
      };

      script.onload = function () {
        self.libLoaded = true;
      };
    }
  },

  _isEmptyObject: function (obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
  },

  _extend: function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) {
        continue;
      }

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
  },

  _getISODate: function () {
    var now = new Date(Date.now());

    return now.toISOString();
  },

  _track: function (eventName, eventData, params) {
    var canSend = this.libLoaded,
      eventParams = {};

    if (eventData && !this._isEmptyObject(eventData)) {
      window.digitalData.event.push(eventData);

      eventParams.eventIndex = window.digitalData.event.length - 1;

      if (typeof params === 'object' && !this._isEmptyObject(params)) {
        eventParams = this._extend(eventParams, params);
      }

      if (canSend) {
        _satellite.track(eventName, eventParams);
      }
    } else if (canSend) {
      _satellite.track(eventName);
    }
  },

  _deepExtend: function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            out[key] = this._deepExtend(out[key], obj[key]);
          } else {
            out[key] = obj[key];
          }
        }
      }
    }

    return out;
  },

  _setTrackingData: function (callRule, attributes, data) {
    var eventData = {
      'eventInfo': {
        'timestamp': this._getISODate(),
        'eventAction': data.eventAction || '',
        'eventName': data.eventName || ''
      },
      'attributes': attributes,
      'primaryCategory': ''
    }
    this._track(callRule, eventData);
  },

  /** Search Tracking */
  searchTrack: function (searchType, searchPhrase, searchResultSelected, searchUnderlying , searchFilterSelected, searchValueEntered, searchProductType, searchFirstLevelFilter, searchInvestmentType, searchCurrency, searchMaturityType, searchTopic, searchRegion, searchSidewaysReturn, searchDistance2Barrier, searchUnderlyingType, searchBrcCategory, searchComponent) {
    var callRule = 'KeyInvest - Search',
      eventName,
      eventAction,
      attributes;

    if (searchType == 'global') {
      eventAction = 'Global Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchPhrase': searchPhrase,
        'searchResultSelected': searchResultSelected,
        'searchComponent': searchComponent
      };
    } else if (searchType == 'quick') {
      eventAction = 'Quick Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchUnderlying': searchUnderlying,
        'searchFilterSelected': searchFilterSelected,
        'searchValueEntered': searchValueEntered,
        'searchProductType': searchProductType,
        'searchComponent': searchComponent
      };
    } else if (searchType == 'product') {
      eventAction = 'Product Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchFilterSelected': searchFilterSelected,
        'searchFirstLevelFilter': searchFirstLevelFilter,
        'searchInvestmentType' : searchInvestmentType,
        'searchProductType': searchProductType,
        'searchUnderlying': searchUnderlying,
        'searchCurrency': searchCurrency,
        'searchComponent': searchComponent

      };
    } else if (searchType == 'themes') {
      eventAction = 'Themes Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchFilterSelected': searchFilterSelected,
        'searchCurrency': searchCurrency,
        'searchMaturityType': searchMaturityType,
        'searchTopic': searchTopic,
        'searchRegion': searchRegion,
        'searchComponent': searchComponent

      };
    } else if (searchType == 'yield') {
      eventAction = 'Yield Monitor Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchFilterSelected': searchFilterSelected,
        'searchSidewaysReturn': searchSidewaysReturn,
        'searchDistance2Barrier' : searchDistance2Barrier,
        'searchUnderlying': searchUnderlying,
        'searchCurrency': searchCurrency,
        'searchUnderlyingType': searchUnderlyingType,
        'searchBrcCategory': searchBrcCategory,
        'searchComponent': searchComponent
      };
    } else if (searchType == 'main_register') {
      eventAction = 'Main Register Search';
      eventName = 'eventName - TBF';
      attributes = {
        'searchPhrase': searchPhrase,
        'searchComponent': searchComponent
      };
    }

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAction
    });
  },
  /** Page Load Tracking */
  pageloadTrack: function (pagePath, channel, userAgent, networkType, pageCountry, language, productISIN, deviceRendition, errorPage, ContentType) {
    var callRule = 'KeyInvest - Page view';

    this._deepExtend(window.digitalData, {
      'page': {
        'attributes': {
          'channel': channel,
          'pageCountry': pageCountry,
          'pagePath': pagePath,
          'productISIN': productISIN,
        },
        'pageInfo': {
          'language': language
        }
      },
      'user': {
        'profile': {
          'attributes': {
            'userAgent': userAgent,
            'networkType': networkType,
            'deviceRendition': deviceRendition,
            'errorPage': errorPage,
            'ContentType': ContentType
          }
        }
      }
    });

    this._track(callRule);
  },

  /** CTA Links Tracking */
  clickTrack: function (CTAText, CTAURL, CTAType, CTAParentComp) {
    var callRule = 'KeyInvest - Click on CTA',
      attributes = {
        'CTAText': CTAText,
        'CTAURL': CTAURL,
        'CTAType': CTAType,
        'CTAParentComponent': CTAParentComp
      },
      eventAction = 'eventAction - TBF',
      eventName = 'eventName - TBF';

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAction
    })
  },

  /** Product Interaction Tracking */
  productTrack: function (prodSIN, eventAct) {
    var callRule = 'KeyInvest - ISIN Copy',
      attributes = {
        'productISIN': prodSIN
      },
      eventName = 'eventName - TBF';

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAct
    });

  },

  /** Document Download Tracking */
  docDownloadTrack: function (docTitle, docName) {
    var callRule = 'KeyInvest - Document Download',
      attributes = {
        'documentName': docName,
        'documentTitle': docTitle
      },
      eventAction = 'eventAction - TBF',
      eventName = 'eventName - TBF';

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAction
    });
  },

  /** Content Interaction Tracking */
  contentClickTrack: function (CTAText, CTAURL, CTAType, CTAParentComp, ContentType, ContentID, ContentTitle, ContentURL, PublishingDate, ContentAuthor, ProductISIN) {
    var callRule = 'KeyInvest - Content Clicks',
      attributes = {
        'CTAText': CTAText,
        'CTAURL': CTAURL,
        'CTAType': CTAType,
        'CTAParentComponent': CTAParentComp,
        'ContentType': ContentType,
        'ContentID': ContentID,
        'ContentTitle': ContentTitle,
        'ContentURL': ContentURL,
        'PublishingDate': PublishingDate,
        'ContentAuthor': ContentAuthor,
        'ProductISIN': ProductISIN
      },
      eventAction = 'eventAction - TBF',
      eventName = 'eventName - TBF';

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAction
    })
  },

  /** Form Tracking */
  formTrack: function (formName, eventName, formErrorMessage, formDocumentOrderSelected) {
    var callRule = 'KeyInvest - Form Tracking',
      eventName,
      eventAction,
      attributes;

    if (eventName == 'Form Start') {
      attributes = {
        'formName': formName
      };
    } else if (eventName == 'Form Error') {
      attributes = {
        'formName': formName,
        'formError': formErrorMessage
      };
    } else if (eventName == 'Form Success') {
      attributes = {
        'formName': formName,
        'formDocumentOrderSelected': formDocumentOrderSelected
      };
    }
    eventAction = 'Form Track';

    this._setTrackingData(callRule, attributes, {
      'eventName': eventName,
      'eventAction': eventAction
    });
  }
}

