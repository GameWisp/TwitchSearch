var pageHeight = 0;

$(function () {
    getLanguageList();
    getGamesList();
    setupPagination();
    createRangeSlider("viewers", 0, 10000, 1);
    createRangeSlider("fps", 0, 120, 10);
    createRangeSlider("uptime", 0, 24, 1);
    createRangeSlider("age", 0, 48, 1);
    createRangeSlider("followers", 0, 10000, 1);
    createRangeSlider("views", 0, 10000, 1);
    setupCombo("#mature_combo", "#ismature");
    setupCombo("#partner_combo", "#ispartner");
    setupCombo("#order_combo", "#orderby");
    setPersistentData();
    setupPreviews();
});

var sliders = [];
function createRangeSlider(name, min, max, step) {
    var elem = "#" + name;
    $(elem + "_slider").slider({
        range: true,
        min: min,
        max: max,
        step: step,
        values: [min, max],
        slide: function (event, ui) {
            $(elem + "_display").text(getSliderText(elem + "_slider", ui.values[0], ui.values[1]));
        },
        change: function (event, ui) {
            $(elem + "_display").text(getSliderText(elem + "_slider", ui.values[0], ui.values[1]));
            $(elem + "From").val(ui.values[0]);
            $(elem + "To").val(ui.values[1]);
        }
    });
    $(elem + "_display").text(getSliderText(elem, min, max));
    $(elem + "From").val(min);
    $(elem + "To").val(max);
    sliders.push(elem + "_slider");
}

function getSliderText(elem, from, to) {
    var max = $(elem).slider("option", "max");
    var min = $(elem).slider("option", "min");
    if (from == to) {
        return (to == max ? ">= " : "= ") + from;
    }
    if (to == max) {
        return ">= " + from;
    }
    if (from == min) {
        return "<= " + to;
    }
    return "[" + from + ", " + to + "]";
}

function getLanguageList() {
    var $el = $("#langs_combo");
    $.post("ajax/languages", function (data) {
        var langs = JSON.parse(data);
        $el.empty(); // remove old options
        $el.append($("<option></option>").attr("value", "").text(""));
        $.each(langs, function (value, key) {
            $el.append($("<option></option>").attr("value", key.ID).text(key.Language));
        });
        var l = getParameter('language');
        if (l)
            $el.val(l);
        setupCombo("#langs_combo", "#language");
    });
}

function getGamesList() {
    var $el = $("#game");
    $.post("ajax/games_list", function (data) {
        $el.autocomplete({
            source: JSON.parse(data),
            minLength: 4,
            autoFocus: true
        });
    });
}

function setupPagination() {
    var $el = $("#pagination");
    $.post("ajax/pagination",
        {
            game: getParameter("game"),
            broadcaster: getParameter("broadcaster"),
            language: getParameter("language"),
            status: getParameter("status"),
            viewersFrom: getParameter("viewersFrom"),
            viewersTo: getParameter("viewersTo"),
            fpsFrom: getParameter("fpsFrom"),
            fpsTo: getParameter("fpsTo"),
            uptimeFrom: getParameter("uptimeFrom"),
            uptimeTo: getParameter("uptimeTo"),
            ageFrom: getParameter("ageFrom"),
            ageTo: getParameter("ageTo"),
            followersFrom: getParameter("followersFrom"),
            followersTo: getParameter("followersTo"),
            viewsFrom: getParameter("viewsFrom"),
            viewsTo: getParameter("viewsTo"),
            ismature: getParameter("ismature"),
            ispartner: getParameter("ispartner"),
            orderby: getParameter("orderby")
        },
        function (data) {
            var pages = JSON.parse(data);
            if (pages > 1) {
                var cur_page = parseInt(getParameter("page")) || 1;
                var range = getRange(cur_page, 1, pages, 3);
                $el.empty();

                if (!rangeContains(range, 1)) {
                    $el.append($("<a></a>").attr("href", getPageLink(1)).text(1));
                    $el.append($("<span></span>").html("..."));
                }
                for (var i = 0; i < range.length; i++) {
                    var new_page = range[i];
                    if (new_page == cur_page) {
                        $el.append($("<a></a>").attr("href", getPageLink(new_page)).text(new_page).attr("class", "current"));
                    } else {
                        $el.append($("<a></a>").attr("href", getPageLink(new_page)).text(new_page));
                    }
                }
                if (!rangeContains(range, pages)) {
                    $el.append($("<span></span>").html("..."));
                    $el.append($("<a></a>").attr("href", getPageLink(pages)).text(pages));
                }
            }
        }
    );
}

function getRange(x, min, max, size) {
    var range = [];
    var half = Math.floor(size / 2);
    var leftInd = Math.max(x - half, min);
    var rightInd = Math.min(x + half, max);

    for (var i = leftInd, ind = 0; i <= rightInd && ind < size; i++, ind++) {
        range[ind] = i;
    }
    return range;
}

function rangeContains(range, x) {
    for (var i = 0; i < range.length; i++) {
        if (range[i] === x)
            return true;
    }
    return false;
}

function getPageLink(page) {
    var link = "";
    var search = window.location.search;
    var ind = search.indexOf("?");
    if (ind > -1) {
        var indPage = search.indexOf("page=");
        if (indPage > -1) {
            var s = search.substring(indPage);
            var indAmpersand = s.indexOf("&");
            link = search.substring(0, indPage) + "page=" + page +
                (indAmpersand > -1 ? s.substring(indAmpersand) : "");
        } else {
            link = search + "&page=" + page;
        }
    } else {
        link = "?page=" + page;
    }
    return link;
}

function setupCombo(elem, valueElem) {
    $(elem).on('change', function () {
        $(valueElem).val(this.value);
    });
    $(valueElem).val($(elem).val());
}

function setPersistentData() {
    var game = getParameter('game'),
        broadcaster = getParameter('broadcaster'),
        viewers = [getParameter('viewersFrom'), getParameter('viewersTo')],
        status = getParameter('status'),
        fps = [getParameter('fpsFrom'), getParameter('fpsTo')],
        isM = getParameter('ismature'),
        isP = getParameter('ispartner'),
        up = [getParameter('uptimeFrom'), getParameter('uptimeTo')],
        age = [getParameter('ageFrom'), getParameter('ageTo')],
        followers = [getParameter('followersFrom'), getParameter('followersTo')],
        views = [getParameter('viewsFrom'), getParameter('viewsTo')],
        orderby = getParameter('orderby');

    if (game)
        $("#game").val(replaceAll("+", " ", game));
    if (broadcaster)
        $("#broadcaster").val(replaceAll("+", " ", broadcaster));
    if (viewers[0])
        $("#viewers_slider").slider('values', 0, viewers[0]);
    if (viewers[1])
        $("#viewers_slider").slider('values', 1, viewers[1]);
    if (status)
        $("#status").val(replaceAll("+", " ", status));
    if (fps[0])
        $("#fps_slider").slider('values', 0, fps[0]);
    if (fps[1])
        $("#fps_slider").slider('values', 1, fps[1]);
    if (isM) {
        $("#mature_combo").val(isM);
        $("#ismature").val(isM);
    }
    if (isP) {
        $("#partner_combo").val(isP);
        $("#ispartner").val(isP);
    }
    if (up[0])
        $("#uptime_slider").slider('values', 0, up[0]);
    if (up[1])
        $("#uptime_slider").slider('values', 1, up[1]);
    if (age[0])
        $("#age_slider").slider('values', 0, age[0]);
    if (age[1])
        $("#age_slider").slider('values', 1, age[1]);
    if (followers[0])
        $("#followers_slider").slider('values', 0, followers[0]);
    if (followers[1])
        $("#followers_slider").slider('values', 1, followers[1]);
    if (views[0])
        $("#views_slider").slider('values', 0, views[0]);
    if (views[1])
        $("#views_slider").slider('values', 1, views[1]);
    if (orderby) {
        $("#order_combo").val(orderby);
        $("#orderby").val(orderby);
    }
}

function getParameter(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function resetSearch() {
    // Text inputs
    $("#game").val("");
    $("#broadcaster").val("");
    $("#status").val("");

    // Combos
    $("#mature_combo").val("");
    $("#partner_combo").val("");
    $("#langs_combo").val("");
    $("#order_combo").val("");
    $('#mature_combo').trigger('change');
    $('#partner_combo').trigger('change');
    $('#langs_combo').trigger('change');
    $('#order_combo').trigger('change');

    // Sliders
    for (var i = 0; i < sliders.length; i++) {
        var $el = $(sliders[i]);
        var max = $el.slider("option", "max");
        var min = $el.slider("option", "min");
        $el.slider('values', 0, min);
        $el.slider('values', 1, max);
    }
}

function setupPreviews() {
    var body = document.body,
        html = document.documentElement;
    pageHeight = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    $("td.preview").hover(function (e) {
            this.t = this.title;
            this.title = "";
            var c = (this.t != "") ? "<br/>" + this.t : "";
            $("body").append("<p id='preview'>" +
                "<img src='" + this.getAttribute("preview-img") + "' alt='Image preview' />" + c + "</p>");
            var pos = getPreviewPos(e);
            $("#preview")
                .css("top", pos[1] + "px")
                .css("left", pos[0] + "px")
                .fadeIn("fast");
        },
        function () {
            this.title = this.t;
            $("#preview").remove();
        });
    $("td.preview").mousemove(function (e) {
        var pos = getPreviewPos(e);
        $("#preview")
            .css("top", pos[1] + "px")
            .css("left", pos[0] + "px");
    });
}

function getPreviewPos(e) {
    var yOffset = 90;
    var xOffset = -350;
    var mX = e.pageX;
    var mY = e.pageY;

    var x = 0, y = 0;

    var tmpX = mX + xOffset,
        tmpY = mY - yOffset;

    if (tmpY < 10) {
        y = 10;
    } else if (tmpY + 50 + yOffset * 2 > pageHeight) {
        y = pageHeight - 50 - yOffset * 2;
    } else {
        y = tmpY;
    }
    x = tmpX;
    return [x, y];
}

function toggle(div_id) {
    var el = document.getElementById(div_id);
    if ( el.style.display == 'none' ) {	el.style.display = 'block';}
    else {el.style.display = 'none';}
}
function blanket_size(popUpDivVar) {
    if (typeof window.innerWidth != 'undefined') {
        viewportheight = window.innerHeight;
    } else {
        viewportheight = document.documentElement.clientHeight;
    }
    if ((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight)) {
        blanket_height = viewportheight;
    } else {
        if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight) {
            blanket_height = document.body.parentNode.clientHeight;
        } else {
            blanket_height = document.body.parentNode.scrollHeight;
        }
    }
    var blanket = document.getElementById('blanket');
    blanket.style.height = blanket_height + 'px';
    var popUpDiv = document.getElementById(popUpDivVar);
    popUpDiv_height=blanket_height/2-150;//150 is half popup's height
    popUpDiv.style.top = popUpDiv_height + 'px';
}
function window_pos(popUpDivVar) {
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerHeight;
    } else {
        viewportwidth = document.documentElement.clientHeight;
    }
    if ((viewportwidth > document.body.parentNode.scrollWidth) && (viewportwidth > document.body.parentNode.clientWidth)) {
        window_width = viewportwidth;
    } else {
        if (document.body.parentNode.clientWidth > document.body.parentNode.scrollWidth) {
            window_width = document.body.parentNode.clientWidth;
        } else {
            window_width = document.body.parentNode.scrollWidth;
        }
    }
    var popUpDiv = document.getElementById(popUpDivVar);
    window_width=window_width/2-150;//150 is half popup's width
    popUpDiv.style.left = window_width + 'px';
}
function popup(windowname) {
    blanket_size(windowname);
    window_pos(windowname);
    toggle('blanket');
    toggle(windowname);
}

function replaceAll(find, replace, str) {
    return str.split(find).join(replace);
}