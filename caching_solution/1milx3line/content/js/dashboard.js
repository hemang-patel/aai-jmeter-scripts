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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.36607142857142855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.5, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 4105.346153846153, 26, 30590, 6640.4, 24619.949999999946, 30590.0, 0.5997693194925029, 0.9107036656574394, 0.6465587153979239], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 3947.0, 2474, 6560, 6560.0, 6560.0, 6560.0, 0.05706351168850931, 0.0753788184999905, 0.04162738596808248], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 4894.666666666667, 3977, 6612, 6612.0, 6612.0, 6612.0, 0.0553515747523017, 0.03675690510895035, 0.038810967453274045], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1663.3333333333333, 612, 2722, 2722.0, 2722.0, 2722.0, 0.05644402634054563, 0.09811559266227658, 0.12231376411100658], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 8327.0, 1062, 21403, 21403.0, 21403.0, 21403.0, 0.0419533478771606, 0.020444063076858535, 0.026179872356939086], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1489.0, 1489, 1489, 1489.0, 1489.0, 1489.0, 0.671591672263264, 5.105801922431161, 1.1195380708529215], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1489.0, 1489, 1489, 1489.0, 1489.0, 1489.0, 0.671591672263264, 5.105801922431161, 1.1195380708529215], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 1130.3333333333333, 116, 3130, 3130.0, 3130.0, 3130.0, 0.05972407477454162, 0.23547460731420836, 0.035811115148016166], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 176.66666666666669, 26, 478, 478.0, 478.0, 478.0, 0.05760811122206007, 0.016202281281204392, 0.030097987796681772], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 239.33333333333331, 54, 589, 589.0, 589.0, 589.0, 0.05805739941555551, 0.02364251519168618, 0.030672903402163606], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 975.6666666666667, 460, 1512, 1512.0, 1512.0, 1512.0, 0.0565973663358865, 0.030343705193751652, 0.030785872118250766], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 3105.3333333333335, 1359, 6545, 6545.0, 6545.0, 6545.0, 0.0582977069568597, 0.052946159638554216, 0.04025046759619121], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 173.66666666666666, 113, 248, 248.0, 248.0, 248.0, 0.05973358819664298, 0.03278347320948569, 0.037450159787348426], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 189.66666666666666, 157, 226, 226.0, 226.0, 226.0, 0.05962673662870431, 0.03680087651302844, 0.035345145638304216], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 4106.0, 2746, 6632, 6632.0, 6632.0, 6632.0, 0.05655362225950572, 0.027117020048259093, 0.038494018276245594], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 3518.6666666666665, 1954, 6568, 6568.0, 6568.0, 6568.0, 0.05753739930955121, 0.040455983889528195, 0.040455983889528195], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 3584.0, 1831, 6624, 6624.0, 6624.0, 6624.0, 0.057763401109057304, 0.031025264267560075, 0.03621494483595194], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 3546.6666666666665, 1880, 6552, 6552.0, 6552.0, 6552.0, 0.05770340450086555, 0.023498359059434506, 0.040572706289671086], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 12929.333333333332, 1661, 30585, 30585.0, 30585.0, 30585.0, 0.05796205417519997, 0.023603688077205455, 0.040754569341937476], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 271.6666666666667, 43, 700, 700.0, 700.0, 700.0, 0.058732551537813975, 0.030169259871963037, 0.03361062031363182], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 19547.333333333332, 6644, 30590, 30590.0, 30590.0, 30590.0, 0.04194982800570518, 0.46243130715664066, 0.3348202580963168], "isController": false}]}, function(index, item){
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
