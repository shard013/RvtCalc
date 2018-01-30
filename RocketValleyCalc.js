$(function () {
    ListResources();
    SetParamsFromUrl();
});

function ListResources() {
    var keys = [];
    for (k in Resources) {
        keys.push(k);
    }
    keys.sort();

    for (var i in keys) {
        var resourceKey = keys[i];
        var resource = Resources[resourceKey];
        var mined = IsMined(resourceKey);
        if (!mined) {
            var resListDiv = '<div class="Resource"><input type="hidden" class="ResourceKey" value="' + resourceKey + '" />' + resource.Name + '</div>';
            $("#ResourcesList").append(resListDiv);
        }
    }

    $(document).on('click', '.Resource', function (resource) {
        var resourceKey = $(resource.target).find('.ResourceKey').val();
        Calculate(resourceKey);
    });

}

function Calculate(resourceKey) {
    var amount = parseFloat($("#AmountWanted").val());
    var period = parseFloat($('#Period').val());
    var periodType = $('#PeriodType').val();
    var totals = {};

    var amountAdjusted = AmountToAdjusted(amount, period, periodType);

    SetWindowUrl(resourceKey, amount, period, periodType);
    CalculateRequired(resourceKey, amountAdjusted, totals);
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

    if (amount !== null) {
        $("#AmountWanted").val(amount);
    }

    if (period !== null) {
        $("#Period").val(period);
    }

    if (periodType !== null) {
        $("#PeriodType").val(periodType);
    }

    if (resourceKey !== null) {
        Calculate(resourceKey);
    }
}

function GetUrl(resourceKey, amount, period, periodType) {
    var baseUrl = location.protocol + '//' + location.host + location.pathname;
    var newUrl = baseUrl + '?resource=' + resourceKey + '&amount=' + amount + '&period=' + period + '&periodType=' + periodType;
    return newUrl;
}

function SetWindowUrl(resourceKey, amount, period, periodType) {
    var newUrl = GetUrl(resourceKey, amount, period, periodType);
    window.history.replaceState({}, "", newUrl);
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

    var requiredMinedList = $("#RequiredMinedList");
    var requiredBuiltList = $("#RequiredBuiltList");
    requiredMinedList.empty();
    requiredBuiltList.empty();

    $("#Required").css('display', 'table-cell');
    var periodPlural = '';
    if (period !== 1) {
        periodPlural = 's';
    }
    $("#Required").find("h4").text("Creating " + amount + " " + Resources[resourceKey].Name + " per " + period + " " + periodType + periodPlural + " requires (per second):");
    
    for (var i in keys) {
        var key = keys[i];
        var name = Resources[key].Name;
        var requiredAmount = totals[key].Amount;
        var requiredFrom = "";
        for (var fromKey in totals[key].From) {
            requiredFrom += Resources[fromKey].Name + ': ' + totals[key].From[fromKey].Amount.toLocaleString() + '\n';
        }

        var mined = IsMined(key);
        var requiredList = null;
        if (mined) {
            requiredList = requiredMinedList;
        }
        else {
            requiredList = requiredBuiltList;
        }

        var approxMaxLevel = 1000;
        if (Resources[key].ApproxMaxLevel !== undefined) {
            approxMaxLevel = Resources[key].ApproxMaxLevel;
        }

        var displayAmount = requiredAmount;
        if (displayAmount < 0.001) {
            displayAmount = '<0.001';
        }

        var unadjustedAmount = AmountFromAdjusted(requiredAmount, $("#Period").val(), $("#PeriodType").val());

        var url = GetUrl(key, unadjustedAmount, $("#Period").val(), $("#PeriodType").val());
        var approxMines = '';
        if (mined) {
            approxMines = requiredAmount / approxMaxLevel / Resources[key].Produced;
            if (approxMines < 0.001) {
                approxMines = '<0.001';
            }
        }
        var localeOptions = { minimumFractionDigits: 3 };
        var reqTr = '<tr title="' + requiredFrom + '">';
        reqTr += '<td><a href="' + url + '">' + name + '</a></td>';
        reqTr += '<td style="text-align: right;">' + displayAmount.toLocaleString('en-GB', localeOptions) + '</td>';
        reqTr += '<td style="text-align: right;">' + approxMines.toLocaleString('en-GB', localeOptions) + '</td>';
        reqTr += '</tr>';
        requiredList.append(reqTr);
        
    }
}

function CalculateRequired(resourceKey, amount, totals) {
    var resource = Resources[resourceKey];

    if (resource === undefined) {
        alert('Resource ' + resourceKey + ' could not be found');
        return;
    }

    var producedPerLevel = Resources[resourceKey].Produced;

    for (var requiredKey in resource.Required) {
        var requiredAmount = resource.Required[requiredKey] * amount / producedPerLevel;

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

        CalculateRequired(requiredKey, requiredAmount, totals);
    }

}
