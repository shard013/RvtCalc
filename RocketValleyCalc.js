$(function () {
    ListResources();
    SetParamsFromUrl();

    $(window).on('popstate', function (event) {
        SetParamsFromUrl();
    });
});

function ListResources() {
    var keys = [];
    for (k in Resources) {
        keys.push(k);
    }
    keys.sort();

    $('#Resource').empty();
    $('#Resource').append('<option value="">Select resource...</option>');
    for (var i in keys) {
        var resourceKey = keys[i];
        var resource = Resources[resourceKey];
        var mined = IsMined(resourceKey);
        if (!mined) {
            var resOption = '<option value="' + resourceKey + '">' + resource.Name + '</option>';
            $("#Resource").append(resOption);
        }
    }

    $('.Options').change(function () {
        SetWindowUrl();
        Calculate();
    });

}

function Calculate() {
    var resourceKey = $('#Resource').val();
    var amount = parseFloat($("#AmountWanted").val());
    var period = parseFloat($('#Period').val());
    var periodType = $('#PeriodType').val();
    var colaBoost = $('#ColaBoost').val();
    var techBoost = $('#TechBoost').val();
    var totals = {};
    var amountAdjusted = AmountToAdjusted(amount, period, periodType);

    if (resourceKey === null || resourceKey.length < 1) {
        return;
    }

    CalculateRequired(resourceKey, amountAdjusted, totals, colaBoost, techBoost);
    PrintRequired(resourceKey, amount, period, periodType, totals);
}

function AmountToAdjusted(amount, period, periodType) {
    var amountAdjusted = amount / period;
    if (periodType === 'minute') {
        amountAdjusted = amountAdjusted / 60;
    }
    else if (periodType === 'hour') {
        amountAdjusted = amountAdjusted / 3600;
    }
    else if (periodType === 'day') {
        amountAdjusted = amountAdjusted / 86400;
    }
    return amountAdjusted;
}

function AmountFromAdjusted(amount, period, periodType) {
    var amountAdjusted = amount * period;
    if (periodType === 'minute') {
        amountAdjusted = amountAdjusted * 60;
    }
    else if (periodType === 'hour') {
        amountAdjusted = amountAdjusted * 3600;
    }
    else if (periodType === 'day') {
        amountAdjusted = amountAdjusted * 86400;
    }
    return amountAdjusted;
}

function SetParamsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var resourceKey = params.get('resource');
    var amount = params.get('amount');
    var period = params.get('period');
    var periodType = params.get('periodType');
    var colaBoost = params.get('colaBoost');
    var techBoost = params.get('techBoost');

    if (amount !== null) {
        $("#AmountWanted").val(amount);
    }

    if (period !== null) {
        $("#Period").val(period);
    }

    if (periodType !== null) {
        $("#PeriodType").val(periodType);
    }

    if (colaBoost !== null) {
        $("#ColaBoost").val(colaBoost);
    }

    if (techBoost !== null) {
        $("#TechBoost").val(techBoost);
    }

    if (resourceKey !== null) {
        $("#Resource").val(resourceKey);
        Calculate();
    }
}

function GetUrl(resourceKey, amount, period, periodType, colaBoost, techBoost) {
    var baseUrl = location.protocol + '//' + location.host + location.pathname;
    var newUrl = baseUrl + '?resource=' + resourceKey + '&amount=' + amount + '&period=' + period + '&periodType=' + periodType + '&colaBoost=' + colaBoost + '&techBoost=' + techBoost;
    return newUrl;
}

function SetWindowUrl() {
    var resourceKey = $('#Resource').val();
    var amount = parseFloat($("#AmountWanted").val());
    var period = parseFloat($('#Period').val());
    var periodType = $('#PeriodType').val();
    var colaBoost = $('#ColaBoost').val();
    var techBoost = $('#TechBoost').val();
    var newUrl = GetUrl(resourceKey, amount, period, periodType, colaBoost, techBoost);
    window.history.pushState({}, "", newUrl);
}

function IsMined(resourceKey) {
    return Object.keys(Resources[resourceKey].Required).length === 0;
}

function PrintRequired(resourceKey, amount, period, periodType, totals) {
    var keys = [];
    for (k in totals) {
        keys.push(k);
    }
    keys.sort();

    $("#RequiredMinedList").empty();
    $("#RequiredBuiltList").empty();

    $("#Required").css('display', 'table-cell');
    var periodPlural = '';
    if (period !== 1) {
        periodPlural = 's';
    }
    $("#Required").find("h4").text("Creating " + amount + " " + Resources[resourceKey].Name + " per " + period + " " + periodType + periodPlural + " requires (per second):");

    document.title = Resources[resourceKey].Name + ' - RVT Calc';

    for (var i in keys) {
        var key = keys[i];
        PrintRequiredResource(key, totals);
    }

    if ($('#RequiredBuiltList').children().length === 0) {
        $('#ReqiredFactories').hide();
    }
    else {
        $('#ReqiredFactories').show();
    }

    $('.Factory').on('click', function (event) {
        if (event.ctrlKey) {
            return;
        }
        event.preventDefault();
        var key = $(event.target).find('.FactoryKey').val();
        var amount = $(event.target).find('.FactoryAmount').val();
        $("#AmountWanted").val(amount);
        $("#Resource").val(key);
        SetWindowUrl();
        Calculate();
    });
}

function PrintRequiredResource(key, totals) {
    var name = Resources[key].Name;
    var requiredAmount = totals[key].Amount;
    var requiredFrom = "Of " + requiredAmount.toLocaleString() + " " + name + ";\n";
    for (var fromKey in totals[key].From) {
        requiredFrom += ' &bull; ' + totals[key].From[fromKey].Amount.toLocaleString() + ' is required to make ' + Resources[fromKey].Name + '\n';
    }

    var displayAmount = requiredAmount;
    if (displayAmount < 0.001) {
        displayAmount = '<0.001';
    }

    var approxMaxLevel = 1000;
    if (Resources[key].ApproxMaxLevel !== undefined) {
        approxMaxLevel = Resources[key].ApproxMaxLevel;
    }

    var unadjustedAmount = AmountFromAdjusted(requiredAmount, $("#Period").val(), $("#PeriodType").val());

    var url = GetUrl(key, unadjustedAmount, $("#Period").val(), $("#PeriodType").val(), $("#ColaBoost").val(), $("#TechBoost").val());
    var approxMines = '';
    var mined = IsMined(key);
    if (mined) {
        approxMines = requiredAmount / approxMaxLevel / Resources[key].Produced;
        if (approxMines < 0.001) {
            approxMines = '<0.001';
        }
    }

    var localeOptions = { minimumFractionDigits: 3 };
    var reqTr = '<tr title="' + requiredFrom + '">';
    if (mined) {
        reqTr += '<td>' + name + '</td>';
    }
    else {
        reqTr += '<td><a class="Factory" href="' + url + '">';
        reqTr += '<input type="hidden" class="FactoryKey" value="' + key + '" />';
        reqTr += '<input type="hidden" class="FactoryAmount" value="' + unadjustedAmount + '" />';
        reqTr += name + '</a></td>';
    }
    reqTr += '<td class="NumberCell">' + displayAmount.toLocaleString('en-GB', localeOptions) + '</td>';
    reqTr += '<td class="NumberCell">' + approxMines.toLocaleString('en-GB', localeOptions) + '</td>';
    reqTr += '</tr>';
    if (mined) {
        $("#RequiredMinedList").append(reqTr);
    }
    else {
        $("#RequiredBuiltList").append(reqTr);
    }

}

function CalculateRequired(resourceKey, amount, totals, colaBoost, techBoost) {
    var resource = Resources[resourceKey];

    if (resource === undefined) {
        alert('Resource ' + resourceKey + ' could not be found');
        return;
    }

    var producedPerLevel = Resources[resourceKey].Produced;

    for (var requiredKey in resource.Required) {
        var requiredAmount = resource.Required[requiredKey] * amount / producedPerLevel / colaBoost / (techBoost / 100);

        if (!(requiredKey in totals)) {
            totals[requiredKey] = {};
            totals[requiredKey].Amount = 0;
            totals[requiredKey].From = {};
        }
        totals[requiredKey].Amount += requiredAmount;

        if (!(resourceKey in totals[requiredKey].From)) {
            totals[requiredKey].From[resourceKey] = {};
            totals[requiredKey].From[resourceKey].Amount = 0;
        }
        totals[requiredKey].From[resourceKey].Amount += requiredAmount;

        if (Resources[requiredKey] === undefined) {
            alert('Resource ' + requiredKey + ' could not be found, defined in ' + resourceKey);
            return;
        }

        CalculateRequired(requiredKey, requiredAmount, totals, colaBoost, techBoost);
    }

}
