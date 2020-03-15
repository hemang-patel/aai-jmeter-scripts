/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.48214285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 2983.6730769230776, 26, 7853, 7812.8, 7836.75, 7853.0, 1.1578712981518593, 1.7403078726898242, 1.2471557698730795], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 5341.333333333333, 5227, 5489, 5489.0, 5489.0, 5489.0, 0.10010344022156227, 0.12512930027695285, 0.07292692031766158], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 7191.666666666667, 7177, 7203, 7203.0, 7203.0, 7203.0, 0.09404388714733541, 0.06281837774294671, 0.06584908894984326], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 952.6666666666666, 622, 1597, 1597.0, 1597.0, 1597.0, 0.10576787477083627, 0.18364773568608095, 0.22919815831688053], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 195.0, 160, 214, 214.0, 214.0, 214.0, 0.1207535018515537, 0.058843747484302045, 0.07535301531556915], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1735.0, 1735, 1735, 1735.0, 1735.0, 1735.0, 0.5763688760806917, 4.342466678674351, 0.9608024135446686], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1735.0, 1735, 1735, 1735.0, 1735.0, 1735.0, 0.5763688760806917, 4.342466678674351, 0.9608024135446686], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 216.0, 167, 301, 301.0, 301.0, 301.0, 0.12041422493377217, 0.4611958888576704, 0.07220149815364854], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 26.333333333333332, 26, 27, 27.0, 27.0, 27.0, 0.1097293343087052, 0.030861375274323335, 0.05732929087417703], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 244.33333333333331, 84, 555, 555.0, 555.0, 555.0, 0.10946108658371949, 0.04446856642463604, 0.057830515470500235], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 598.6666666666666, 462, 871, 871.0, 871.0, 871.0, 0.10643581920102178, 0.056855852639608316, 0.057895264936493294], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 7819.333333333333, 7796, 7835, 7835.0, 7835.0, 7835.0, 0.0923020121838656, 0.08518105616577441, 0.06363791074395421], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 156.66666666666666, 126, 182, 182.0, 182.0, 182.0, 0.12087026591458501, 0.0663370014101531, 0.07577999093473005], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 268.0, 142, 363, 363.0, 363.0, 363.0, 0.12076808502073184, 0.08220249537055674, 0.07147017531500342], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 5194.0, 5081, 5252, 5252.0, 5252.0, 5252.0, 0.10073536818777072, 0.04741645260400927, 0.06846857056512543], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 5326.333333333333, 5197, 5484, 5484.0, 5484.0, 5484.0, 0.10025062656641605, 0.06999921679197994, 0.07039082080200501], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 379.3333333333333, 317, 434, 434.0, 434.0, 434.0, 0.11956001912960307, 0.06421680714968915, 0.07495852761836443], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 5126.0, 5036, 5229, 5229.0, 5229.0, 5229.0, 0.10085050593337143, 0.04077354439103103, 0.07081202516220123], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 5134.666666666667, 5058, 5227, 5227.0, 5227.0, 5227.0, 0.10084711577248891, 0.04077217375958048, 0.07080964476603469], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 83.33333333333333, 48, 145, 145.0, 145.0, 145.0, 0.11170688114387846, 0.05748977183869526, 0.06392600815460232], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 7837.666666666667, 7820, 7853, 7853.0, 7853.0, 7853.0, 0.09225092250922509, 1.0057512684501844, 0.735574982702952], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
