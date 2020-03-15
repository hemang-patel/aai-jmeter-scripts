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

    var data = {"OkPercent": 53.84615384615385, "KoPercent": 46.15384615384615};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41964285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.5, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 24, 46.15384615384615, 14211.730769230768, 25, 30204, 30165.9, 30173.05, 30204.0, 0.43986905436612334, 0.519692797461448, 0.47378774309109517], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, 100.0, 30146.666666666668, 30136, 30161, 30161.0, 30161.0, 30161.0, 0.029278575890068707, 0.008234599469081824, 0.021329900013663337], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, 100.0, 30153.666666666668, 30142, 30168, 30168.0, 30168.0, 30168.0, 0.029278290147855365, 0.008234519104084322, 0.020500521519543256], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1055.6666666666667, 628, 1787, 1787.0, 1787.0, 1787.0, 0.03892716727003776, 0.06800849828720465, 0.08435486735567753], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 787.3333333333334, 512, 989, 989.0, 989.0, 989.0, 0.04092155338216639, 0.019941264782911156, 0.025536008409379217], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 2211.0, 2211, 2211, 2211.0, 2211.0, 2211.0, 0.4522840343735866, 3.4530825983717777, 0.7539539518317504], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 2211.0, 2211, 2211, 2211.0, 2211.0, 2211.0, 0.4522840343735866, 3.4530825983717777, 0.7539539518317504], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 151.66666666666666, 136, 167, 167.0, 167.0, 167.0, 0.04137018037398643, 0.15896276339014836, 0.024805947997683268], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 169.0, 25, 454, 454.0, 454.0, 454.0, 0.03952881650723377, 0.011117479642659498, 0.020652262530634832], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 189.33333333333334, 98, 307, 307.0, 307.0, 307.0, 0.0396814899076744, 0.01654687127986032, 0.020964537148488133], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 609.6666666666666, 457, 908, 908.0, 908.0, 908.0, 0.03907369298496965, 0.020910531011487665, 0.021253952141238375], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, 100.0, 30148.666666666668, 30127, 30175, 30175.0, 30175.0, 30175.0, 0.02927171961595504, 0.008232671141987355, 0.020181478563344003], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 169.66666666666666, 136, 235, 235.0, 235.0, 235.0, 0.04139301285942933, 0.022717649635741487, 0.025951478765384402], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 198.33333333333334, 161, 218, 218.0, 218.0, 218.0, 0.04135820339964432, 0.0293223199884197, 0.02447565552752388], "isController": false}, {"data": ["getQuerySummary", 3, 3, 100.0, 30143.333333333332, 30137, 30149, 30149.0, 30149.0, 30149.0, 0.02928029046048137, 0.008235081692010385, 0.01990144742235843], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, 100.0, 30149.666666666668, 30142, 30157, 30157.0, 30157.0, 30157.0, 0.02927571871889455, 0.008233795889689092, 0.02055590015516131], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 2035.3333333333333, 1384, 2371, 2371.0, 2371.0, 2371.0, 0.04017032216598378, 0.02157585663212019, 0.025184909014220293], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 3, 100.0, 30133.333333333332, 30122, 30139, 30139.0, 30139.0, 30139.0, 0.02927371903084474, 0.008233233477425083, 0.02055449607732165], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 3, 100.0, 30144.0, 30139, 30149, 30149.0, 30149.0, 30149.0, 0.02926829268292683, 0.008231707317073171, 0.020550685975609755], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 87.66666666666667, 45, 118, 118.0, 118.0, 118.0, 0.039817899473076464, 0.0204533350808967, 0.02278641512814727], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, 100.0, 30182.333333333332, 30171, 30204, 30204.0, 30204.0, 30204.0, 0.02926229748051619, 0.23683219474546677, 0.23332681535977995], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 21, 87.5, 40.38461538461539], "isController": false}, {"data": ["Assertion failed", 3, 12.5, 5.769230769230769], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52, 24, "500\/Internal Server Error", 21, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getQuerySummary", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
