function setSameSite()
{
    var samesite = ';SameSite=Strict; Secure';
    return samesite;
}

function getHostName(url)
{
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0)
    {
        return match[2];
    }
    else
    {
        return null;
    }
}

function getDomain(url)
{
    var hostName = getHostName(url);
    var domain = hostName;
    
    if (hostName != null)
    {
        var parts = hostName.split('.').reverse();
        
        if (parts != null && parts.length > 1)
        {
            domain = parts[1] + '.' + parts[0];
                
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2)
            {
                domain = parts[2] + '.' + domain;
            }
        }
    }
    
    return domain;
}

// Opt-out function
function gaOptout() {
  var sPath = window.location.pathname;
  var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; domain='+domainPoint + setSameSite();
  window[disableStr] = true;

  if (sPage == "cookies.html")
  {
       console.log('GA is checked'); 
       $('#check').val('c_is_off');
       $('#toggle_on').css({'display' : 'none'});
       $('#toggle_off').css({'display' : 'block'});
       //$('.lcs_switch').removeClass('lcs_on').addClass('lcs_off');
       $('.lcs_switch').lcs_off();
  }

  if (existDc != "")
  {
    setDisclaimerCookie("2");
  }
  event_ga_deactivate();
}

function gaOptoutSwitchToOff() {
  document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/; domain='+domainPoint + setSameSite();
  window[disableStr] = true;
  if (existDc != "")
  {
    setDisclaimerCookie("2");
  }
}

function gaOptin() {
  window[disableStr] = false;
  delete_cookie(disableStr);
  if (existDc != "")
  {
    setDisclaimerCookie("1");
  }
  
  event_ga_deactivate();
}

/**
 * function show_hide_content()
 * Event-Handler, blendet Inhaltsblöcke ein und aus
 */
function show_hide_content(elem) {
  if (document.all) {  // IE
    // im IE kann hier nicht auf "this" zugegriffen werden, aber der
    // Funktionsparameter enthält das Element, durch das das Event ausgelöst wurde
    var this_div = elem.srcElement;
  } else {
    // außerhalb des IE enthält "this" das Element, durch das das Event ausgelöst wurde
    var this_div = this;
  }

  if (document.getElementById("ga_offid"))
  {
      if (document.getElementById("ga_offid") == this_div) {
          next_div = document.getElementById("ga_offid");
      }
  }

  // je nach aktuellem Status das entsprechende DIV ein- oder ausblenden
  // und den Text des Trigger-DIVs anpassen
  if (next_div.style.display != 'block')
  {
    if (next_div.className == 'ga_off btn')
    {
      if(next_div.id == 'ga_offid')
      {
        //
      }
      else
      {
        next_div.style.display   = 'block';
      }   
    }
    else
    {
      next_div.style.display   = 'block';
    }
  }
  else
  {
    if (next_div.className == 'ga_off btn')
    {
      next_div.style.display   = 'none';
    }
    else
    {
      exCk = getCookieVal(ckDivName);
      setSessionCookie();
      next_div.style.display   = 'none';
    }
    
  }
}

/**
 * function event_init()
 * Event-Listener einrichten
 */
function event_init() {
  
  // document.getElementById("linkToggle").innerHTML = "Test<div><\/div>";
  // alle DIVs durchgehen
  var arr_all_divs = document.getElementById("ckRules").childNodes;
  for (var int_counter = 0; int_counter < arr_all_divs.length; int_counter++) {
    // Trigger-DIV (mit der CSS-Klasse "toggleLink") gefunden?
    if (arr_all_divs[int_counter].className == 'toggleLink') {
      if (arr_all_divs[int_counter].addEventListener) {
        // Variante für Browser außer IE
        arr_all_divs[int_counter].addEventListener('click', show_hide_content, false);
      } else if (arr_all_divs[int_counter].attachEvent) {
        // Variante für IE, der addEventListener nicht kennt
        arr_all_divs[int_counter].attachEvent('onclick', show_hide_content);
      }
    }

    // Content-DIV (mit der CSS-Klasse "toggleContent") gefunden?
    if (arr_all_divs[int_counter].className == 'toggleContent') {
      if (document.cookie.indexOf(disableStr + '=true') > -1)
      {
        arr_all_divs[int_counter].style.display = 'none';
      }
      else
      {
        // explizit CSS-Style "display: block;" setzen, da sonst trotz Stylesheet undefiniert
        // und somit erst der zweite Klick auf den Trigger zu einer Aktion führen würde
        arr_all_divs[int_counter].style.display = 'block';
      }
    }
  }
}

function delete_cookie(name) {
  var isCk = getCookieVal(name);
  if(isCk != "") {
  
    if (isCk == "true" && name == disableStr)
    {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; domain='+domainPoint + setSameSite();
      window[disableStr] = false;
      //alert('Disable Tracking Cookie ' + name + ' is deleted and Tracking is activated');
    }
    else
    {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT'+ setSameSite();
      //alert('Other Cookie ' + name + ' is deleted');
    }   
  }
}

function deactivate_cookie(name){
  document.cookie = name + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/' + setSameSite();
}

function getCookieVal(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function event_ga_deactivate() {
  var is_dc = getCookieVal(ckDcName);
  var is_ck = getCookieVal(disableStr);
  
  if (is_ck != "")
  {
    // Delete all GA Cookies
    delAllCookies();
  }
  else
  {
    // Wenn Ga disable Cookie nicht existiert
  }
  
  if (existCookie != "" || exCk != "" || is_ck != "" || is_dc != "0")
  {
    if (document.getElementById("linkToggle"))
    {
      document.getElementById("linkToggle").innerHTML = "Show Cookie info!<div><\/div>";
    }
    
    if (is_dc == "1" || is_dc == "2")
    {
      if (document.getElementById("ga_question"))
      {
        document.getElementById("ga_question").style.display = 'none';
      }

      if (document.getElementById("ga_offid"))
      {
        document.getElementById("ga_offid").style.display = "none";
      }
      
      if (document.getElementById("ga_yesid"))
      {
        document.getElementById("ga_yesid").style.display = "none";
      }
      
      if (document.getElementById("linkToggle"))
      {
        document.getElementById("linkToggle").style.display = "none";
      }
      
      if (document.getElementById("contentToggle"))
      {
        document.getElementById("contentToggle").style.display = "none";
      }
    }
  }
  else
  {    
    // Wenn GA Cookie nicht existiert
    if (document.getElementById("linkToggle"))
    {
      document.getElementById("linkToggle").innerHTML = "Hide Cookie info!<div><\/div>";
    }
    
    if (document.getElementById("ga_offid"))
    {
      //document.getElementById("ga_offid").style.display = "block";
      document.getElementById("ga_offid").removeAttribute("display");
    }
  }
  
  if (document.getElementById("ga_offid"))
  {
      if (document.getElementById("ga_offid").className == 'ga_off btn')
      {
          if (document.getElementById("ga_offid").addEventListener)
          {
              document.getElementById("ga_offid").addEventListener('click', show_hide_content, false);
              if(is_ck != "" || exCk != "" || is_dc == "1" || is_dc == "2") {
               document.getElementById("contentToggle").style.display = 'none';
              }
          } else if(document.getElementById("ga_offid").attachEvent) {
              document.getElementById("ga_offid").attachEvent('onclick', show_hide_content);
          }
      }
  }
}

function init()
{
    event_init();
    event_ga_deactivate();
}

function setSessionCookie()
{
  if (exCk != "")
  {
    //    
  }
  else
  {
    //Set session cookie
    document.cookie = ckDivName + '=true; path=/; domain='+domainPoint + setSameSite();
  }  
}

function setDisclaimerCookie(initVal)
{
  var expires = new Date();
  expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000); //one year
  setCookie(ckDcName, initVal, expires, '/', domainPoint, 1);
}

function closeAdvert()
{
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    setSessionCookie();
    if (document.getElementById("contentToggle").style.display == "block")
    {
        document.getElementById("contentToggle").style.display = "none";
        if (document.getElementById("linkToggle"))
        {
          document.getElementById("linkToggle").innerHTML = "Show Cookie info!<div><\/div>";
        }
    }
    if (sPage == "" || sPage != "cookies.html")
    {
      //alert(sPage);
      document.getElementById("linkToggle").style.display = "none";
    }
}

function setCookie(name, value, expires, path, domain, samesitesecure) {
  var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((samesitesecure) ? setSameSite() : "");
  document.cookie = curCookie;
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else
    begin += 2;
  var end = document.cookie.indexOf(";", begin);
  if (end == -1)
    end = dc.length;
  return unescape(dc.substring(begin + prefix.length, end));
}

// Find out what cookies are supported. Returns:
// null - no cookies
// false - only session cookies are allowed
// true - session cookies and persistent cookies are allowed
// (though the persistent cookies might not actually be persistent, if the user has set
// them to expire on browser exit)
//
function getCookieSupport()
{
    var persist = true;
    do
    {
        var c = 'gCSTest=' + Math.floor(Math.random()*100000000);
        document.cookie= persist? c+';expires=Tue, 01-Jan-2030 00:00:00 GMT' : c;
        if (document.cookie.indexOf(c) !== -1)
        {
            document.cookie = c + ';expires=Sat, 01-Jan-2000 00:00:00 GMT';
            return persist;
        }
    } while (!(persist = !persist));
    return null;
}

function getBrowserCookieStatus(elementId)
{
    var statusCk = getCookieSupport();
    var cookieMessage = '';

    if (statusCk == null)
    {
        cookieMessage = 'no cookies';
    }
    else if (statusCk == false)
    {
        cookieMessage = 'only session cookies are allowed';
    }
    else if (statusCk == true)
    {
        cookieMessage = 'session cookies and persistent cookies are allowed';
    }
    
    if (document.getElementById(elementId))
    {
        document.getElementById(elementId).innerHTML = cookieMessage;
    }
}

function delAllCookies() {
    var theCookies = document.cookie.split(';');
    var trimString = '';
    var posName = -1;
    var ckName = '';
    var ckNames = [];
    var ckValue = '';
    var msg = '';
    
    if (theCookies != "")
    {
        for (var i = 1 ; i <= theCookies.length; i++)
        {
            if(typeof String.prototype.trim !== 'function')
            {
              String.prototype.trim = function()
              {
                  return this.replace(/^\s+|\s+$/g, '');  
              }
            }
            trimString = theCookies[i-1].trim();
            posName = trimString.indexOf('=');
            ckName = trimString.substring(0, posName);
            ckValue = trimString.substring(posName+1);
            
            if(ckName == disableStr || ckName == ckDcName || ckName == "fe_typo_user" || ckName == "ckDiv")
            {
                //ckNames.push(ckName);
            }
            else
            {
                ckNames.push(ckName);
            }
        }
        
        if (ckNames.length > 0)
        {
            for (var z = 1; z <= ckNames.length; z++)
            {
                msg += ckNames[z-1] + "\n";

                if(ckNames[z-1].indexOf('_')>=0)
                {
                  //document.cookie = ckNames[z-1] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain='+ domainW.replace('www','') + '; path=/'; domainPoint
                  document.cookie = ckNames[z-1] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain='+ domainPoint + '; path=/' + setSameSite();
                }
                else
                {                  
                  document.cookie = ckNames[z-1] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain='+ domainPoint + '; path=/' + setSameSite();
                }
              
                if (z == ckNames.length)
                {
                    msg += "All cookies deleted";
                }
            }
        }
        else
        {
            msg = "No requiring approval cookies exists!"
        }
        return msg
    }
    else
    {
        msg = "No cookies exists!";
        return msg;
    }
}

var isCkLink = true;
// Set to the same value as the web property used on the site
var gaProperty = 'UA-21578486-1';

var domainW = String(window.location.hostname);
var urlPs = String(window.location.href);
var domainPoint = "."+getDomain(urlPs);

var isLoaded = 0;

// Disable tracking if the opt-out cookie exists.
var disableStr = 'ga-disable-' + gaProperty;
var existCookie = getCookieVal(disableStr);

var ckDcName = 'cookieDisclaimer';
var existDc = getCookieVal(ckDcName);
// Session Cookie Name to hide Cookie Div for this session
var ckDivName = "ckDiv";
var exCk = getCookieVal(ckDivName);

if (isCkLink == false)
{
  if (document.getElementById("linkToggle"))
  {
    document.getElementById("linkToggle").style.display = 'none';
  }
}

if (existCookie != "")
{
  //alert('Cookie existiert');
  if (document.cookie.indexOf(disableStr + '=true') > -1)
  {
    window[disableStr] = true; 
  }
  else
  {
    window[disableStr] = true;
    delete_cookie(disableStr);
  }
}

if (existDc == "1" || existDc == "2")
{
  if (document.getElementById("ga_question"))
  {
    document.getElementById("ga_question").style.display = 'none';
  }
  
  if (document.getElementById("ga_yesid"))
  {
    document.getElementById("ga_yesid").style.display = 'none';
  }
  
  if (document.getElementById("ga_offid"))
  {
    document.getElementById("ga_offid").style.display = 'none';
  }
}
else
{
    setDisclaimerCookie("0");
}

existDc = getCookieVal(ckDcName);

$(document).ready(function() {
  if (!existCookie)
  {
    // Tracking von GA ist aktiviert
    if($('.lcs_check').length)
      {
        $('input').lcs_on();
      }
  }
  else
  {
    //$('input').lcs_off();
  }

  isLoaded = 1;

  $(function() {
      $("#ga_yesid").trigger('focus');
  });

  init();
});