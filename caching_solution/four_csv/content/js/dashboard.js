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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8392857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.5, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [1.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 367.84615384615387, 24, 1573, 623.4, 1042.6999999999962, 1573.0, 1.483975913929397, 2.2291688218800836, 1.5984065986986675], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 420.6666666666667, 363, 460, 460.0, 460.0, 460.0, 0.13303179459890913, 0.16654957097246242, 0.09691574098709592], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 602.0, 571, 622, 622.0, 622.0, 622.0, 0.13198416190057194, 0.08816129564452266, 0.09241469148702156], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1299.6666666666667, 632, 1664, 1664.0, 1664.0, 1664.0, 0.1278281989006775, 0.22207652914482934, 0.2770027083599642], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 266.3333333333333, 234, 286, 286.0, 286.0, 286.0, 0.1340422679951745, 0.06531942551717974, 0.08364551684464501], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1573.0, 1573, 1573, 1573.0, 1573.0, 1573.0, 0.6357279084551812, 4.767959313413859, 1.0597534567705023], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1573.0, 1573, 1573, 1573.0, 1573.0, 1573.0, 0.6357279084551812, 4.767959313413859, 1.0597534567705023], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 163.0, 141, 194, 194.0, 194.0, 194.0, 0.13451105232479937, 0.5146186191319553, 0.08065408801506524], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 146.66666666666669, 24, 386, 386.0, 386.0, 386.0, 0.13340448239060834, 0.03752001067235859, 0.06969863093649947], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 58.0, 54, 62, 62.0, 62.0, 62.0, 0.1331853496115427, 0.054106548279689234, 0.07036452552719201], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 932.0, 512, 1473, 1473.0, 1473.0, 1473.0, 0.13265531726730045, 0.07099132213132876, 0.0721572380057484], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 295.6666666666667, 272, 312, 312.0, 312.0, 312.0, 0.13385686239514547, 0.12353001461270749, 0.09228803208102802], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 161.66666666666666, 138, 190, 190.0, 190.0, 190.0, 0.1347648353622928, 0.07396273190782085, 0.08449123467049999], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 204.33333333333334, 161, 226, 226.0, 226.0, 226.0, 0.13436044428520244, 0.0914543258464708, 0.07951409105159442], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 457.0, 448, 465, 465.0, 465.0, 465.0, 0.132890365448505, 0.06255191029900332, 0.09032392026578073], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 325.0, 286, 368, 368.0, 368.0, 368.0, 0.1338986833296139, 0.0934937095514394, 0.09401675128319571], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 471.6666666666667, 467, 476, 476.0, 476.0, 476.0, 0.13289625232568442, 0.07137982302649065, 0.08331972069637636], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 277.3333333333333, 201, 316, 316.0, 316.0, 316.0, 0.1337852301105958, 0.054088950454869784, 0.09393709028273278], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 293.0, 270, 307, 307.0, 307.0, 307.0, 0.13386283521484987, 0.054120325956003745, 0.0939915805854268], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 163.0, 42, 405, 405.0, 405.0, 405.0, 0.13135426244581636, 0.06760126592670433, 0.07516952909496914], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 614.3333333333334, 581, 638, 638.0, 638.0, 638.0, 0.13189132155104194, 1.4376239915809375, 1.0516529692033765], "isController": false}]}, function(index, item){
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
