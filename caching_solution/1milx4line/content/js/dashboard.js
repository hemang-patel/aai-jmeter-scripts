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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42857142857142855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 2639.6153846153848, 25, 21412, 4484.1, 14322.949999999939, 21412.0, 0.783439298520505, 1.1904457835522946, 0.8445572155512702], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 2945.0, 2834, 3102, 3102.0, 3102.0, 3102.0, 0.08645533141210375, 0.11347262247838616, 0.06306848883285301], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 4290.666666666667, 4092, 4475, 4475.0, 4475.0, 4475.0, 0.08293478561357918, 0.056531719099881125, 0.05815153913139634], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 883.3333333333333, 588, 1472, 1472.0, 1472.0, 1472.0, 0.10087085168622441, 0.17534191015769476, 0.21858634755051948], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 7751.666666666667, 833, 21406, 21406.0, 21406.0, 21406.0, 0.05631899076368552, 0.027444508194413155, 0.03514437021288579], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1310.0, 1310, 1310, 1310.0, 1310.0, 1310.0, 0.7633587786259541, 5.818374284351145, 1.2725131202290076], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1310.0, 1310, 1310, 1310.0, 1310.0, 1310.0, 0.7633587786259541, 5.818374284351145, 1.2725131202290076], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 153.33333333333334, 141, 176, 176.0, 176.0, 176.0, 0.09374707040404986, 0.36861030709977816, 0.05621162229305335], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 26.0, 25, 27, 27.0, 27.0, 27.0, 0.10445682451253481, 0.02937848189415042, 0.05457461046309192], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 209.33333333333334, 58, 512, 512.0, 512.0, 512.0, 0.10271510254391071, 0.04182831812579176, 0.05426647507446845], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 607.0, 463, 892, 892.0, 892.0, 892.0, 0.102880658436214, 0.05515769675925926, 0.05596145190329218], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 1510.3333333333333, 1332, 1670, 1670.0, 1670.0, 1670.0, 0.08985802432157192, 0.08213585035643682, 0.062040647651710294], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 174.0, 167, 179, 179.0, 179.0, 179.0, 0.09363295880149813, 0.051388401217228465, 0.058703476123595506], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 145.33333333333334, 138, 158, 158.0, 158.0, 158.0, 0.09369144284821987, 0.05782518738288569, 0.055537798641474075], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 2939.3333333333335, 2841, 3113, 3113.0, 3113.0, 3113.0, 0.08639308855291578, 0.04117170626349892, 0.05880467062634989], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 1958.3333333333333, 1875, 2045, 2045.0, 2045.0, 2045.0, 0.08892314076533184, 0.06278460036458487, 0.06252408335062394], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 5285.666666666667, 2527, 10491, 10491.0, 10491.0, 10491.0, 0.08723212468378354, 0.046853191968829054, 0.054690453170887735], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 2058.6666666666665, 1750, 2495, 2495.0, 2495.0, 2495.0, 0.08925914906277893, 0.036435863582267185, 0.06276033918476644], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 3084.6666666666665, 1900, 3720, 3720.0, 3720.0, 3720.0, 0.08453561767357981, 0.034507703308160505, 0.0594391061767358], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 41.0, 40, 42, 42.0, 42.0, 42.0, 0.10291595197255575, 0.05286503001715266, 0.0588952615780446], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 12136.333333333332, 4488, 21412, 21412.0, 21412.0, 21412.0, 0.05630630630630631, 0.6210372970626876, 0.44940570453265766], "isController": false}]}, function(index, item){
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
