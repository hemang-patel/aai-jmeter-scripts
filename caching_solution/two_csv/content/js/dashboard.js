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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 371.0769230769232, 25, 1347, 856.0000000000006, 1152.9499999999998, 1347.0, 1.6245938515371157, 2.42798187171957, 1.7498677088540364], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 364.3333333333333, 208, 645, 645.0, 645.0, 645.0, 0.15811943287830074, 0.19363453987245033, 0.11519247746798082], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 379.0, 228, 661, 661.0, 661.0, 661.0, 0.1577784790154623, 0.10323396576207006, 0.11047575142000632], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1452.3333333333333, 615, 2133, 2133.0, 2133.0, 2133.0, 0.13670539986329458, 0.23749893198906358, 0.29623953349282295], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 241.66666666666666, 146, 373, 373.0, 373.0, 373.0, 0.15844512517164888, 0.07721105220766875, 0.09887347166473011], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1347.0, 1347, 1347, 1347.0, 1347.0, 1347.0, 0.7423904974016332, 5.580253572754269, 1.2375591592427617], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1347.0, 1347, 1347, 1347.0, 1347.0, 1347.0, 0.7423904974016332, 5.580253572754269, 1.2375591592427617], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 138.33333333333334, 120, 154, 154.0, 154.0, 154.0, 0.15855398763278897, 0.6049515914856509, 0.09507045742825432], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 150.66666666666666, 25, 400, 400.0, 400.0, 400.0, 0.14352693522150992, 0.04036695053104966, 0.07498721713233183], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 256.3333333333333, 60, 628, 628.0, 628.0, 628.0, 0.14575134819997085, 0.05921148520623816, 0.07700339782830491], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 614.3333333333334, 458, 919, 919.0, 919.0, 919.0, 0.13765256492612646, 0.07366563044874735, 0.07487546744516839], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 343.3333333333333, 163, 654, 654.0, 654.0, 654.0, 0.1584618635115149, 0.14762950956053245, 0.10925202699133743], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 175.66666666666666, 129, 259, 259.0, 259.0, 259.0, 0.15858751387640746, 0.08703728788920018, 0.09942693741079452], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 179.0, 166, 197, 197.0, 197.0, 197.0, 0.15815277558121146, 0.10764891072275817, 0.09359431836153724], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 379.6666666666667, 221, 694, 694.0, 694.0, 694.0, 0.15775358889414734, 0.0717902074459694, 0.10722314245149077], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 321.0, 167, 601, 601.0, 601.0, 601.0, 0.15854560828665046, 0.10992908387062678, 0.11132255113095867], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 311.6666666666667, 188, 546, 546.0, 546.0, 546.0, 0.15809443507588533, 0.08491400321458685, 0.09911780011593592], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 328.0, 147, 660, 660.0, 660.0, 660.0, 0.15842839036755385, 0.0635879574619772, 0.111240246752218], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 658.0, 171, 1147, 1147.0, 1147.0, 1147.0, 0.15817779183802594, 0.06348737543498892, 0.11106428938627017], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 431.0, 41, 1066, 1066.0, 1066.0, 1066.0, 0.1503457953292573, 0.07737522865089706, 0.0860377305302195], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 711.0, 260, 1164, 1164.0, 1164.0, 1164.0, 0.1575713010137087, 1.706663378460003, 1.256415696071222], "isController": false}]}, function(index, item){
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
