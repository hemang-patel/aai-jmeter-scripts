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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 1613.769230769231, 26, 4200, 4165.5, 4185.45, 4200.0, 1.4023732470334411, 2.105587791599245, 1.5105114785598706], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 2790.3333333333335, 2764, 2810, 2810.0, 2810.0, 2810.0, 0.1389274798555154, 0.17230263614893024, 0.10121083981661572], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 3753.0, 3735, 3768, 3768.0, 3768.0, 3768.0, 0.13308490817141339, 0.08798679964067074, 0.09318542886611658], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 876.0, 590, 1440, 1440.0, 1440.0, 1440.0, 0.14245014245014245, 0.2472010772792023, 0.3086883457977208], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 188.0, 181, 196, 196.0, 196.0, 196.0, 0.1581361024721944, 0.07706046399768067, 0.098680634257551], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1621.0, 1621, 1621, 1621.0, 1621.0, 1621.0, 0.6169031462060457, 4.724369602097471, 1.0283727251696484], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1621.0, 1621, 1621, 1621.0, 1621.0, 1621.0, 0.6169031462060457, 4.724369602097471, 1.0283727251696484], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 141.33333333333334, 126, 167, 167.0, 167.0, 167.0, 0.1583197002480342, 0.6041092208032086, 0.09492997651591112], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 164.66666666666669, 26, 442, 442.0, 442.0, 442.0, 0.14942471484783584, 0.04202570105095382, 0.07806857660507047], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 63.666666666666664, 60, 69, 69.0, 69.0, 69.0, 0.15231519090170595, 0.06172930100020308, 0.08047120925568643], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 592.3333333333334, 451, 869, 869.0, 869.0, 869.0, 0.14340344168260039, 0.07660320566443594, 0.07800362989961758], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 4170.333333333333, 4155, 4183, 4183.0, 4183.0, 4183.0, 0.13058239749281797, 0.12216595390441369, 0.09003044202141551], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 163.0, 159, 170, 170.0, 170.0, 170.0, 0.15827793605571383, 0.08686738287432731, 0.09923284662867995], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 187.0, 157, 205, 205.0, 205.0, 205.0, 0.15801948907031865, 0.10755818738477746, 0.09351543982091125], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 2671.6666666666665, 2655, 2700, 2700.0, 2700.0, 2700.0, 0.13956084852995906, 0.06473769829270562, 0.09485776423520656], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 2788.0, 2751, 2832, 2832.0, 2832.0, 2832.0, 0.1392369813422445, 0.09599737190197717, 0.09776502889167363], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 242.0, 222, 262, 262.0, 262.0, 262.0, 0.15766239226403195, 0.08468194896993904, 0.09884692952491067], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 2634.0, 2620, 2643, 2643.0, 2643.0, 2643.0, 0.14000373343289155, 0.056603071915251074, 0.09830340267407131], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 2640.3333333333335, 2615, 2687, 2687.0, 2687.0, 2687.0, 0.14014762216201065, 0.056661245678781655, 0.09840443392039616], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 55.333333333333336, 46, 69, 69.0, 69.0, 69.0, 0.15278060704827867, 0.0786283006976981, 0.08743108958036261], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 4186.666666666667, 4170, 4200, 4200.0, 4200.0, 4200.0, 0.13048584228611196, 1.418184017659084, 1.0404461936192424], "isController": false}]}, function(index, item){
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
