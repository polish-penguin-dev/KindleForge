//===============================//
//                               //
// Copyright Bluebotlaboratories //
//                               //
// (Sorry I Took This! I'll Remove If You Want Me To) //
//===============================//

function fetchFile(url, timeout, fixKindleFormatting) {
    if (typeof (fixKindleFormatting) === 'undefined') {
      fixKindleFormatting = true
    }
  
    return new Promise(function (callback) {
      // Create iframe
      const iframe = document.createElement("iframe");
      iframe.src = url;
  
      // Add iframe to body
      document.body.appendChild(iframe);
  
      // Timeout To Remove iframe
      if (timeout !== -1) {
        setTimeout(function () {
          iframe.remove();
        }, timeout || 2000);
      }
  
      // Add listener to iframe
      iframe.addEventListener("load", function (event) {
        // Get iframe's documentElement and clone it and get the innerHTML
        iframeSource = event.target.contentDocument.documentElement.innerHTML;
  
        // Remove iframe from DOM
        event.target.remove();
  
        if (fixKindleFormatting) {
          // (replace applies to a lot of file types, not just directory listings)
          iframeSource = iframeSource.replace('<head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">', '').replace('</pre></body>', '');
        }
  
        // Resolve promise
        callback(iframeSource);
      });
    });
  }
  
  
  function getDirectory(location) {
    return new Promise(function (callback) {
      // Get source of directory listing
      fetchFile(location).then(function (data) {
        // Create list
        var files = [];
  
        // Define regex for extracting different things
        const tagReg = new RegExp('<a(\n|.)*?(?=<\/a>)', "gim");
        const hrefReg = new RegExp('href="(\n|.)*?(?=")', 'gim');
        const tagRemovalReg = new RegExp('<a(\n|.)*?>', 'gim');
  
        // Get anchor tags (without closing tag)
        const anchorTags = Array.from(data.matchAll(tagReg));
  
        for (var i = 0; i < anchorTags.length; i++) {
          // Get href source (URL)
          const source = Array.from(anchorTags[i][0].matchAll(hrefReg));
  
          files.push({
            "name": anchorTags[i][0].replace(tagRemovalReg, ''), // Remove anchor tags from match to get only their innerText
            "path": source[0][0].substring(6) // Remove the href=" part of the href source
          });
        }
  
        callback(files); // Resolve promise
      });
    });
  }
  
  function joinPaths(path1, path2) {
    if (path1.slice(-1) == '/') {
      path1 = path1.slice(0, -1);
    }
  
    if (path2.slice(0, 2) == './') {
      path2 = path2.slice(1);
    } else if (path2[0] != '/') {
      path2 = '/' + path2;
    }
  
    return path1 + path2;
  }
  
  function getQueryData() {
    var query = top.location.href.replace('?', '&').split('&').slice(1);
    var queryData = {};
  
    for (var i=0; i < query.length; i++) {
        queryData[query[i].split('=')[0]] = decodeURIComponent(query[i].split('=')[1]);
    }
  
    return queryData;
  }
  
  ////////////////////
  // Menu and Stuff //
  ////////////////////
  if (!window.mesquito) {
    window.mesquito = {};
    window.mesquito.navigationButtons = [];
    window.mesquito.onKindleButton = function(buttonType, buttonID) {};
  }
  var kindle = window.kindle || top.kindle;
  
  window.mesquito.log = function(toLog) {
    var storageLog = JSON.parse(window.localStorage.getItem("log")) || []
    storageLog.push("[" + new Date().toISOString() + "] - " + toLog)
    window.localStorage.setItem("log", JSON.stringify(storageLog))
  }
  
  // Taken from /opt/var/local/mesquite/shared/javascripts/device.js
  window.mesquito.convertPointsToPixels = function(points) {
    if (typeof points === 'number') {
      return parseInt(points * device.DPI / pointsPerInch);
    }
    else {
      throw 'convertPointsToPixels method requires a number argument.';
    }
  }
  
  window.mesquito.updateNavigation = function () {
    var chromeBarConfig = {
      "appId": "com.lab126.store",
      "topNavBar": {
        "searchProviders": [
          {
            "id": "storeType",
            "launcher": "app://com.lab126.store/?action=search&query=",
            "searchContext": {},
            "keyboard": "abc",
            "showResultsPopup": true,
            "resultsSrc": "com.lab126.store",
            "resultsProp": "resultsQuery"
          }
        ],
        "addDefaultSearchProviders": false,
        "template": "title",
        "title": document.title,
        "buttons": [
          {
            "id": "KPP_BACK_APP",
            "state": "enabled",
            "handling": "notifyApp"
          },
          {
            "id": "KPP_SEARCH",
            "state": "enabled",
            "handling": "system"
          },
          {
            "id": "KPP_MORE",
            "state": "enabled",
            "handling": "system"
          },
          {
            "id": "KPP_CLOSE",
            "state": "enabled",
            "handling": "system"
          }
        ]
      },
      "systemMenu": {
        "clientParams": {
          "profile": {
            "name": "default",
            "items": [
              {
                "id": "MESQUITO_HOME",
                "state": "enabled",
                "handling": "notifyApp",
                "label": "Home",
                "position": 0
              }
            ],
            "selectionMode": "none",
            "closeOnUse": true
          }
        }
      }
    }
  
    for (var i=0; i < window.mesquito.navigationButtons.length; i++) {
      chromeBarConfig.systemMenu.clientParams.profile.items.push({
        "id": window.mesquito.navigationButtons[i].id,
        "state": window.mesquito.navigationButtons[i].state,
        "handling": "notifyApp",
        "label": window.mesquito.navigationButtons[i].label,
        "position": 1 + i // Offset for default buttons
      });
    }
  
    kindle.messaging.sendMessage('com.lab126.chromebar', 'configureChrome', chromeBarConfig);
  }
  
  kindle.appmgr.ongo = function (context) {
    window.mesquito.updateNavigation() // Nav must be set every load lol
  
    // Add callbacks for default buttons
    function kindleButtonCallbackFunction(buttonType, buttonID) {
      if (buttonType == "systemMenuItemSelected") {
        switch (buttonID) {
          case "MESQUITO_HOME":
            top.location = "file:///mnt/us/mesquito/index.html"
        }
      }
  
      window.mesquito.onKindleButton(buttonType, buttonID)
    }
  
    kindle.messaging.receiveMessage('searchBarButtonSelected', kindleButtonCallbackFunction);
    kindle.messaging.receiveMessage('systemMenuItemSelected', kindleButtonCallbackFunction);
  }
  
  
  /*
  nativeBridgeRunner(
      'default_status_bar',
      function() 
      {
          // Get the Screen saver prevention status
          return nativeBridge.getIntLipcProperty(
              'com.lab126.powerd', 
              'preventScreenSaver'
          );
      }, 
      function(retVal) {
          document.write('preventScreenSaver is set to '+retVal+'<br>');
      }
  );
  */
  
  function nativeBridgeRunner(pillowID, fkt, callback)
  {
      //--------------------------------------------------------------------------
      // Get function string to use (supplied function object or string )
      var fktString = '';
      if( fkt && {}.toString.call(fkt) === '[object Function]' )
          fktString = fkt.toString();
      else
          fktString = "function(){" + fkt + "}";
          
      //--------------------------------------------------------------------------
      // Empty function, exit
      if( fktString === undefined || fktString.length <= 0 ) return;
      
      //--------------------------------------------------------------------------
      // Get a (at least a little bit) unique key
      var cmdKey = Math.floor((Math.random()*10000000000)).toString();
  
    var appID = "com.lab126.store";
      //--------------------------------------------------------------------------
      // Build the command we send to pillow
      var cmdVal=	"nativeBridge.setLipcProperty('"+appID+"','"+cmdKey+"'," +
                      "function(){" +
                          "try{" +
                              "return " + fktString + "().toString();" + 
                          "}" +
                          "catch(err){" + 
                              "return err;" + 
                          "}" +
                      "}()" +
                  ");";
      
      //--------------------------------------------------------------------------
      // Strip all non-wanted whitespace characters from command
      //cmdVal = cmdVal.replace(/[\t\r\n]+/g, "");
  
      //--------------------------------------------------------------------------
      // Register event handler for the callback if callback is defined
      if( callback && {}.toString.call(callback) === '[object Function]' )
      {
          kindle.messaging.receiveMessage(cmdKey, function(message, value) 
          { 
              callback(value); 
          });					
      }
      
      //--------------------------------------------------------------------------
      // Send pillow the message to execute supplied code
      kindle.messaging.sendMessage(
          'com.lab126.pillow', 
          'interrogatePillow', 
          {
              "pillowId": pillowID, 
              "function": cmdVal
          }
      );
  }