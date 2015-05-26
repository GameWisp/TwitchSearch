var APP_NAME = "Twitch Ninja - Twitch Search Enhanced";
var NO_LOGO = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";

var basicTemplate = "<!DOCTYPE html><html><head>@head</head><body>@body</body></html>";
var LOGO = "<div class='logo'>" +
    "<a href='/'>" +
    "<img src='/img/logo.png' alt='" + APP_NAME + "' width='300' height='112'>" +
    "</a>" +
    "</div>";
var SEARCH = "<div class='search'>" +
    "<form method='get' action='/' id='searchform' class='search-form'>" +
    "<table class='search-table'>" +
    "<tr><th>Game</th><td><div class='ui-widget'><input type='text' id='game' name='game'></div></td></tr>" +
    "<tr><th>Broadcaster</th><td><input type='text' id='broadcaster' name='broadcaster'></td></tr>" +
    "<tr><th>Status</td><td><input type='text' id='status' name='status'></td></tr>" +
    "<tr><th>Language</td><td><select id='langs_combo'></select></td></tr>" +
    "<tr><th>Viewers</td><td><div id='viewers_slider'></div></td>" +
        "<td><span id='viewers_display' class='form-display'></span></td></tr>" +
    "<tr><th>FPS</th><td><div id='fps_slider'></div></td>" +
        "<td><span id='fps_display' class='form-display'></span></td></tr>" +
    "<tr><th>Mature</th><td><select id='mature_combo'>" +
    "<option value=''></option>" +
    "<option value='1'>Yes</option>" +
    "<option value='0'>No</option>" +
    "</select></td></tr>" +
    "<tr><th>Partner</th><td><select id='partner_combo'>" +
    "<option value=''></option>" +
    "<option value='1'>Yes</option>" +
    "<option value='0'>No</option>" +
    "</select></td></tr>" +
    "<tr><th>Uptime (hours)</th><td><div id='uptime_slider'></div></td>" +
        "<td><span id='uptime_display' class='form-display'></span></td></tr>" +
    "<tr><th>Channel age (months)</th><td><div id='age_slider'></div></td>" +
        "<td><span id='age_display' class='form-display'></span></td></tr>" +
    "<tr><th>Followers</th><td><div id='followers_slider'></div></td>" +
        "<td><span id='followers_display' class='form-display'></span></td></tr>" +
    "<tr><th>Views</th><td><div id='views_slider'></div></td>" +
        "<td><span id='views_display' class='form-display'></span></td></tr>" +
    "<tr><th>Order by</th><td><select id='order_combo'>" +
    "<option value=''></option>" +
    "<option value='viewers_desc'>Most Viewers</option>" +
    "<option value='viewers_asc'>Least Viewers</option>" +
    "<option value='fps_desc'>Most FPS</option>" +
    "<option value='fps_asc'>Least FPS</option>" +
    "<option value='followers_desc'>Most Followers</option>" +
    "<option value='followers_asc'>Least Followers</option>" +
    "<option value='uptime_desc'>Longer Uptime</option>" +
    "<option value='uptime_asc'>Shorter Uptime</option>" +
    "<option value='age_desc'>Older Channel</option>" +
    "<option value='age_asc'>Newer Channel</option>" +
    "<option value='views_desc'>Most Views</option>" +
    "<option value='views_asc'>Least Views</option>" +
    "</select></td></tr>" +
    "<tr><td colspan='2' class='button-td'><input type='submit' value='Search'>" +
    "<input type='button' value='Reset' onclick='resetSearch()'></td></tr>" +
    "</table>" +
    "<input type='hidden' id='viewersFrom' name='viewersFrom'><input type='hidden' id='viewersTo' name='viewersTo'>" +
    "<input type='hidden' id='fpsFrom' name='fpsFrom'><input type='hidden' id='fpsTo' name='fpsTo'>" +
    "<input type='hidden' id='uptimeFrom' name='uptimeFrom'><input type='hidden' id='uptimeTo' name='uptimeTo'>" +
    "<input type='hidden' id='ageFrom' name='ageFrom'><input type='hidden' id='ageTo' name='ageTo'>" +
    "<input type='hidden' id='followersFrom' name='followersFrom'><input type='hidden' id='followersTo' name='followersTo'>" +
    "<input type='hidden' id='viewsFrom' name='viewsFrom'><input type='hidden' id='viewsTo' name='viewsTo'>" +
    "<input type='hidden' id='language' name='language'>" +
    "<input type='hidden' id='ismature' name='ismature'>" +
    "<input type='hidden' id='ispartner' name='ispartner'>" +
    "<input type='hidden' id='orderby' name='orderby'>" +
    "</form>" +
    "</div>";
var ABOUT = "<div id='about' class='noselect'><span onclick='popup(\"popup\")'>+ Info</span></div>";
var ABOUT_POPUP = "<div id='blanket' style='display: none;' onclick='popup(\"popup\")'></div>" +
    "<div id='popup' style='display: none;'>" +
    "<h4>About</h4>" +
    "<p>" +
    "Twitchninja.com is a search tool for Twitch.tv's live streams." +
    "</p>" +
    "<h4>Contact</h4>" +
    "<p>" +
    "If you have any question, suggestion or anything else, " +
    "you can send me an email at <a href='mailto:contact@twitchninja.com' target='_top'>contact@twitchninja.com</a> " +
    "or tweet me <a href='https://twitter.com/jmdalmeida92' target='_blank'>@jmdalmeida92</a>." +
    "</p>" +
    "<h4>Disclaimer</h4>" +
    "<p>" +
    "This website is not affiliated with twitch.tv, it merely uses it's API to retrieve the data you see. " +
    "The streams information can have a delay of up to 10 minutes." +
    "</p>" +
    "</div>";
var PAGINATION = "<div id='pagination' class='pagination'></div>";
var TITLE = "<title>" + APP_NAME + "</title>";
var STYLESHEETS = "<link rel='stylesheet' href='css/normalize.css'>" +
    "<link rel='stylesheet' href='//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css'>" +
    "<link rel='stylesheet' type='text/css' href='css/styles.css' />";
var JAVASCRIPTS = "<script src='/js/jquery-1.11.1.min.js'></script>" +
    "<script src='//code.jquery.com/ui/1.11.4/jquery-ui.js'></script>" +
    "<script src='/js/script.js'></script>";
var METATAGS = "<meta charset='UTF-8'>" +
    "<meta name='keywords' content='search, twitch, live, stream, broadcast, ninja, engine'/>" +
    "<meta name='description' content=\"Search through hundreds of Twitch.tv's live streams using " +
    "a wide variety of possible filters.\" />" +
    "<meta name='robots' content='index, nofollow'>";
var FAVICON = "<link rel='shortcut icon' href='img/favicon.ico' type='image/x-icon'>";
var GOOGLE_ANALYTICS = "<script>" +
    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
    "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
    "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
    "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');" +
    "ga('create', 'UA-62894586-1', 'auto');" +
    "ga('send', 'pageview');" +
    "</script>";

module.exports.buildPage = function (rs) {
    var results = "<div id='results'>" +
        "<table class='resulttable'>" +
        "<tr>" +
        "<th>Logo</th>" +
        "<th>Broadcaster</th>" +
        "<th>Game</th>" +
        "<th>Viewers</th>" +
        "<th>Status</th>" +
        "<th>Partner</th>" +
        "<th>Mature</th>" +
        "<th>Language</th>" +
        "<th>FPS</th>" +
        "<th>Followers</th>" +
        "<th>Uptime</th>" +
        "<th>Channel creation</th>" +
        "<th>Views</th>" +
        "<th>Link</th>" +
        "</tr>";
    for (var i = 0; i < rs.length; i++) {
        var r = rs[i];
        results += "<tr>" +
            "<td><img src='" + (r.Logo ? r.Logo : NO_LOGO) + "' alt='Logo' width=60 height=60></td>" +
            "<td>" + r.Display_name + "</td>" +
            "<td>" + (r.Game ? r.Game : "") + "</td>" +
            "<td>" + localeString(r.Viewers) + "</td>" +
            "<td>" + (r.Status ? r.Status : "") + "</td>" +
            "<td>" + (r.isPartner ? "Yes" : "No") + "</td>" +
            "<td>" + (r.isMature ? "Yes" : "No") + "</td>" +
            "<td>" + r.Language + "</td>" +
            "<td>" + r.Average_FPS + "</td>" +
            "<td>" + localeString(r.Followers) + "</td>" +
            "<td>" + timeElapsed(r.Created_at) + "</td>" +
            "<td>" + getParsedDate(r.Channel_created_at) + "</td>" +
            "<td>" + (r.Views ? localeString(r.Views) : "0") + "</td>" +
            "<td class='preview' preview-img='" + r.Preview + "'><a href='" + r.URL + "' target='_blank'>Link</a></tr>";
    }
    results += "</table>" +
        "</div>";
    return build(results);
};

function build(resultTable) {
    var left = "<div id='left'>" + LOGO + SEARCH + ABOUT + "</div>";
    var right = "<div id='right'>" + resultTable + PAGINATION + "</div>";
    var b = ABOUT_POPUP + "<div id='content'>" + left + right + "</div>" + GOOGLE_ANALYTICS;
    var h = TITLE + METATAGS + FAVICON + STYLESHEETS + JAVASCRIPTS;
    return basicTemplate.replace("@head", h).replace("@body", b);
}

function getParsedDate(date) {
    return new Date(date).toUTCString();
}

function timeElapsed(date) {
    var d = Date.parse(date);
    var now = new Date();
    var diff = (now - d) / 1000;

    var days=Math.floor(diff / 86400);
    var hours = Math.floor((diff - (days * 86400 ))/3600)
    var minutes = Math.floor((diff - (days * 86400 ) - (hours *3600 ))/60)
    //var secs = Math.floor((diff - (days * 86400 ) - (hours *3600 ) - (minutes*60)))

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    var te = (days > 0 ? days + " days " : "") + hours + "h " + minutes + "m";

    return te;
}

function localeString(x) {
    var sx = (''+x).split('.'), s = '', i, j;
    var sep = '.'; // default seperator
    var grp  = 3; // default grouping
    i = sx[0].length;
    while (i > grp) {
        j = i - grp;
        s = sep + sx[0].slice(j, i) + s;
        i = j;
    }
    s = sx[0].slice(0, i) + s;
    sx[0] = s;
    return sx.join('.')
}