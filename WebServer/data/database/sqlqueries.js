var RESULTS_PER_PAGE = 20;
var queries = [];
queries['select_search'] = "SELECT * " +
    "FROM Search_view " +
    "WHERE 1 ";
queries['count_search'] = "SELECT COUNT(*) AS 'Count' " +
    "FROM Search_view " +
    "WHERE 1 ";
queries['select_languages'] = "SELECT ID, Language FROM Language ORDER BY ID ASC";
queries['select_games_list'] = "SELECT Game FROM Games_list_view";

module.exports.getQuery = function (key) {
    return queries[key];
};

module.exports.getResultsPerPage = function () {
    return RESULTS_PER_PAGE;
};

var searchQuery;
var searchObjs;
module.exports.buildSearchQuery = function (params, isCount) {
    searchQuery = isCount ? queries['count_search'] : queries['select_search'];
    searchObjs = [];

    var game = params.game;
    var broadcaster = params.broadcaster;
    var viewers = [params.viewersFrom, params.viewersTo];
    var status = params.status;
    var avgfps = [params.fpsFrom, params.fpsTo];
    var language = params.language;
    var ismature = params.ismature;
    var ispartner = params.ispartner;
    var uptime = [params.uptimeFrom, params.uptimeTo];
    var channelage = [params.ageFrom, params.ageTo];
    var followers = [params.followersFrom, params.followersTo];
    var views = [params.viewsFrom, params.viewsTo];
    var page = params.page;

    addStringValue(game, "Game", "s%");
    addStringValue(broadcaster, "Display_name", "s%");
    addIntervalValue(viewers, "Viewers", 10000);
    addStringValue(status, "Status", "%s%");
    addIntervalValue(avgfps, "Average_FPS", 120);
    addNumberValue(language, "LanguageID");
    addNumberValue(ismature, "isMature");
    addNumberValue(ispartner, "isPartner");
    addIntervalValue(uptime, "Uptime", 24);
    addIntervalValue(channelage, "Channel_months", 48);
    addIntervalValue(followers, "Followers", 10000);
    addIntervalValue(views, "Views", 10000);

    switch (params.orderby) {
        case 'viewers_asc':
            searchQuery += "ORDER BY Viewers ASC";
            break;
        case 'viewers_desc':
        default:
            searchQuery += "ORDER BY Viewers DESC";
            break;
        case 'fps_asc':
            searchQuery += "ORDER BY Average_FPS ASC, Viewers DESC";
            break;
        case 'fps_desc':
            searchQuery += "ORDER BY Average_FPS DESC, Viewers DESC";
            break;
        case 'followers_asc':
            searchQuery += "ORDER BY Followers ASC, Viewers DESC";
            break;
        case 'followers_desc':
            searchQuery += "ORDER BY Followers DESC, Viewers DESC";
            break;
        case 'uptime_asc':
            searchQuery += "ORDER BY Created_at DESC, Viewers DESC";
            break;
        case 'uptime_desc':
            searchQuery += "ORDER BY Created_at ASC, Viewers DESC";
            break;
        case 'age_desc':
            searchQuery += "ORDER BY Channel_created_at ASC, Viewers DESC";
            break;
        case 'age_asc':
            searchQuery += "ORDER BY Channel_created_at DESC, Viewers DESC";
            break;
        case 'views_asc':
            searchQuery += "ORDER BY Views ASC, Viewers DESC";
            break;
        case 'views_desc':
            searchQuery += "ORDER BY Views DESC, Viewers DESC";
            break;
    }
    if (page) {
        var p = (page - 1) * RESULTS_PER_PAGE;
        searchQuery += " LIMIT " + p + ", " + RESULTS_PER_PAGE;
    } else {
        searchQuery += " LIMIT " + RESULTS_PER_PAGE;
    }

    return [searchQuery, searchObjs];
};

function addStringValue(value, column, pattern) {
    if (value) {
        var v = pattern.replace("s", value);
        searchQuery += "AND LOWER(" + column + ") LIKE LOWER(?) ";
        searchObjs.push(v);
    }
}

function addIntervalValue(value, column, max) {
    if (value) {
        var from = value[0];
        var to = value[1];
        if (from && to) {
            if (to >= max) {
                searchQuery += "AND " + column + " >= ? ";
                searchObjs.push(from);
            } else {
                searchQuery += "AND " + column + " BETWEEN ? AND ? ";
                searchObjs.push(from, to);
            }
        } else {
            if (from) {
                searchQuery += "AND " + column + " >= ? ";
                searchObjs.push(from);
            } else if (to) {
                searchQuery += "AND " + column + " <= ? ";
                searchObjs.push(to);
            }
        }
    }
}

function addNumberValue(value, column) {
    if (value) {
        searchQuery += "AND " + column + " = ? ";
        searchObjs.push(value);
    }
}