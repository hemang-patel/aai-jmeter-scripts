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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8660714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [1.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 399.9807692307693, 25, 1436, 1174.8, 1187.6, 1436.0, 1.782164644595243, 2.6796061030570977, 1.9195889240180957], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 317.6666666666667, 297, 329, 329.0, 329.0, 329.0, 0.1770329281246312, 0.21990809040481527, 0.12897125427829575], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 389.3333333333333, 371, 409, 409.0, 409.0, 409.0, 0.17627357659086904, 0.11654024546095541, 0.12342593204653624], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 852.3333333333334, 594, 1343, 1343.0, 1343.0, 1343.0, 0.1585037248375337, 0.2752144753526708, 0.3434763334125852], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 172.66666666666666, 170, 174, 174.0, 174.0, 174.0, 0.17846519928613921, 0.0869669281677573, 0.11136646713265914], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1436.0, 1436, 1436, 1436.0, 1436.0, 1436.0, 0.6963788300835655, 5.247323293871866, 1.1608580692896937], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1436.0, 1436, 1436, 1436.0, 1436.0, 1436.0, 0.6963788300835655, 5.247323293871866, 1.1608580692896937], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 302.6666666666667, 148, 589, 589.0, 589.0, 589.0, 0.17866714311238163, 0.6882639881484128, 0.1071304940146507], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 25.666666666666668, 25, 26, 26.0, 26.0, 26.0, 0.16689847009735742, 0.046940194714881776, 0.08719793115438108], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 192.33333333333334, 67, 430, 430.0, 430.0, 430.0, 0.16651865008880995, 0.06748558572935169, 0.08797518525199824], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 586.6666666666666, 459, 842, 842.0, 842.0, 842.0, 0.15965089670586982, 0.08543817519025065, 0.08684135689957959], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 528.6666666666666, 193, 1179, 1179.0, 1179.0, 1179.0, 0.17817901051256163, 0.16669481647561918, 0.12284607560729346], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 480.33333333333337, 121, 1176, 1176.0, 1176.0, 1176.0, 0.17868842694621478, 0.09806923432009053, 0.11202926767526356], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 508.6666666666667, 158, 1156, 1156.0, 1156.0, 1156.0, 0.16857720836142953, 0.1147444474881996, 0.09976346510451788], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 319.0, 298, 350, 350.0, 350.0, 350.0, 0.1770956316410862, 0.08214885256788665, 0.12036968713105076], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 264.3333333333333, 248, 296, 296.0, 296.0, 296.0, 0.1775358030536158, 0.12240261421469997, 0.12465648671440407], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 321.6666666666667, 305, 339, 339.0, 339.0, 339.0, 0.1769702689948089, 0.09505239057338366, 0.11095206317838602], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 671.0, 235, 1172, 1172.0, 1172.0, 1172.0, 0.16847307238726345, 0.0681131366878194, 0.11829310453754142], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 391.3333333333333, 234, 674, 674.0, 674.0, 674.0, 0.17772511848341233, 0.07185371001184834, 0.12478941424763033], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 47.666666666666664, 42, 56, 56.0, 56.0, 56.0, 0.17053206002728513, 0.0877640582366985, 0.09758963591405184], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 934.6666666666666, 424, 1198, 1198.0, 1198.0, 1198.0, 0.16824631260164882, 1.8350458821714992, 1.3415343187426392], "isController": false}]}, function(index, item){
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
