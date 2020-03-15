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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.48214285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 9187.769230769232, 24, 23120, 22987.5, 23069.8, 23120.0, 0.5219887772412892, 0.7843457792941105, 0.562239789849326], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 18615.0, 18420, 18802, 18802.0, 18802.0, 18802.0, 0.038311729774599325, 0.04931138656535342, 0.027910693761573332], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 22817.0, 22705, 22989, 22989.0, 22989.0, 22989.0, 0.03632357036480973, 0.023908287525275154, 0.025433593702703688], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 876.0, 588, 1435, 1435.0, 1435.0, 1435.0, 0.049642573471008734, 0.08619579651509134, 0.10757506887907069], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 585.0, 493, 755, 755.0, 755.0, 755.0, 0.04967956679417755, 0.02420908577177207, 0.03100121404441353], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 2085.0, 2085, 2085, 2085.0, 2085.0, 2085.0, 0.47961630695443647, 3.6678469724220624, 0.7995166366906475], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 2085.0, 2085, 2085, 2085.0, 2085.0, 2085.0, 0.47961630695443647, 3.6678469724220624, 0.7995166366906475], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 162.33333333333334, 127, 224, 224.0, 224.0, 224.0, 0.05, 0.190771484375, 0.02998046875], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 163.0, 24, 441, 441.0, 441.0, 441.0, 0.05047615842783592, 0.014196419557828853, 0.026371821053605683], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 74.0, 67, 86, 86.0, 86.0, 86.0, 0.050794940823893936, 0.020635444709706914, 0.026835999009498655], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 595.0, 450, 882, 882.0, 882.0, 882.0, 0.049757019886222276, 0.026627780173486142, 0.027065097731079894], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 22925.333333333332, 22678, 23114, 23114.0, 23114.0, 23114.0, 0.03615111164668314, 0.03166752651081521, 0.024924496897029583], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 154.33333333333334, 129, 169, 169.0, 169.0, 169.0, 0.04996252810392206, 0.02742084061953535, 0.03132416312765426], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 169.0, 149, 186, 186.0, 186.0, 186.0, 0.049949218294733685, 0.03399863784319276, 0.029559791295516225], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 17413.333333333332, 17235, 17731, 17731.0, 17731.0, 17731.0, 0.03865282036745948, 0.01834499091658721, 0.026271838843507613], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 18146.666666666668, 18001, 18324, 18324.0, 18324.0, 18324.0, 0.03851536120989588, 0.026817824748687265, 0.0270435006932765], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 431.3333333333333, 386, 457, 457.0, 457.0, 457.0, 0.04973639709539441, 0.026713885158659106, 0.03118238958519845], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 16611.0, 16365, 16815, 16815.0, 16815.0, 16815.0, 0.03911291899714475, 0.016004211972464506, 0.02746307495990926], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 16598.333333333332, 16461, 16868, 16868.0, 16868.0, 16868.0, 0.039301481665858805, 0.016081367986323085, 0.027595473943117656], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 44.0, 42, 45, 45.0, 45.0, 45.0, 0.050858663773373794, 0.02612466518046349, 0.029104665010934613], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 23055.0, 22999, 23120, 23120.0, 23120.0, 23120.0, 0.03612107785296313, 0.39299309410142796, 0.2880162115912539], "isController": false}]}, function(index, item){
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
