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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7053571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.5, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 568.2884615384615, 26, 1903, 1122.8, 1163.1999999999998, 1903.0, 1.7275173582273013, 2.5877722085644996, 1.860727737450583], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 857.0, 825, 915, 915.0, 915.0, 915.0, 0.14993253036133738, 0.18302310835124194, 0.1092281910640212], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 1100.6666666666667, 1037, 1152, 1152.0, 1152.0, 1152.0, 0.14836795252225518, 0.09707668768545995, 0.10388654488130564], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 908.6666666666666, 587, 1521, 1521.0, 1521.0, 1521.0, 0.15926948396687193, 0.27654408446591633, 0.34513572746336807], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 161.33333333333334, 129, 222, 222.0, 222.0, 222.0, 0.15533578418681718, 0.0756958557707244, 0.0969331700150158], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1903.0, 1903, 1903, 1903.0, 1903.0, 1903.0, 0.5254860746190225, 3.9801464792433, 0.8759811810299527], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1903.0, 1903, 1903, 1903.0, 1903.0, 1903.0, 0.5254860746190225, 3.9801464792433, 0.8759811810299527], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 137.33333333333334, 128, 154, 154.0, 154.0, 154.0, 0.1552072016141549, 0.5960219262507114, 0.0930636931553624], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 165.66666666666669, 26, 444, 444.0, 444.0, 444.0, 0.16831238779174149, 0.04733785906642728, 0.0879366479185368], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 76.0, 59, 106, 106.0, 106.0, 106.0, 0.17203807776121116, 0.06989046909049203, 0.09089121100470238], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 607.6666666666666, 454, 904, 904.0, 904.0, 904.0, 0.16041065126724413, 0.08568811156560795, 0.08725462183188963], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 1092.6666666666667, 1053, 1151, 1151.0, 1151.0, 1151.0, 0.14819937756261423, 0.1380685607370449, 0.10217652398359928], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 171.66666666666666, 127, 231, 231.0, 231.0, 231.0, 0.1554001554001554, 0.08528797591297592, 0.09742861305361306], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 170.66666666666666, 140, 220, 220.0, 220.0, 220.0, 0.15519917227108124, 0.1056384990946715, 0.09184638515261252], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 899.6666666666666, 872, 926, 926.0, 926.0, 926.0, 0.14955134596211367, 0.06805754611166501, 0.10164818045862413], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 829.0, 773, 904, 904.0, 904.0, 904.0, 0.15027801432650403, 0.10419667008966588, 0.10551747294995742], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 187.66666666666666, 157, 239, 239.0, 239.0, 239.0, 0.15508684863523572, 0.08329860034119106, 0.09723218439826302], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 788.6666666666666, 752, 853, 853.0, 853.0, 853.0, 0.15040609646044317, 0.06036807191918179, 0.10560740562017447], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 788.3333333333334, 747, 856, 856.0, 856.0, 856.0, 0.15051173991571343, 0.06041047373570139, 0.10568158300722458], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 59.333333333333336, 47, 67, 67.0, 67.0, 67.0, 0.1731401858371328, 0.08910632610954002, 0.09908217666070294], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 1122.6666666666667, 1057, 1184, 1184.0, 1184.0, 1184.0, 0.14804579549940783, 1.606576394714765, 1.1804628127467431], "isController": false}]}, function(index, item){
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
