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

    var data = {"OkPercent": 63.46153846153846, "KoPercent": 36.53846153846154};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.5, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 19, 36.53846153846154, 14104.076923076926, 26, 30602, 30162.7, 30336.6, 30602.0, 0.4362050163576881, 0.5244732903070213, 0.46984116789698854], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, 100.0, 30296.666666666668, 30141, 30594, 30594.0, 30594.0, 30594.0, 0.029547334830398297, 0.008310187921049522, 0.021525695101051887], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, 100.0, 30134.666666666668, 30124, 30146, 30146.0, 30146.0, 30146.0, 0.02968093000247341, 0.008347761563195647, 0.020782448058372496], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1123.6666666666667, 609, 2148, 2148.0, 2148.0, 2148.0, 0.04018646519852114, 0.0702085803126507, 0.08708375612843594], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 520.6666666666666, 486, 566, 566.0, 566.0, 566.0, 0.04194572223542736, 0.02044034706589673, 0.026175113777771562], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1933.0, 1933, 1933, 1933.0, 1933.0, 1933.0, 0.5173305742369374, 3.935551927056389, 0.8623860256078634], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1933.0, 1933, 1933, 1933.0, 1933.0, 1933.0, 0.5173305742369374, 3.935551927056389, 0.8623860256078634], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 154.33333333333334, 141, 176, 176.0, 176.0, 176.0, 0.042178075836180356, 0.16103732144614563, 0.025290369690834705], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 360.66666666666663, 26, 1028, 1028.0, 1028.0, 1028.0, 0.04074038866330785, 0.011458234311555331, 0.02128526165514619], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 79.66666666666667, 67, 101, 101.0, 101.0, 101.0, 0.04127682993946065, 0.017212115609521187, 0.021807387692625205], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 613.0, 469, 898, 898.0, 898.0, 898.0, 0.040263592317706584, 0.021547313076272664, 0.02190119230562751], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, 100.0, 30153.666666666668, 30142, 30162, 30162.0, 30162.0, 30162.0, 0.029673884014678683, 0.008345779879128379, 0.020458752064807764], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 157.33333333333334, 140, 186, 186.0, 186.0, 186.0, 0.0421792618629174, 0.023149165202108964, 0.026444420035149387], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 183.33333333333334, 155, 223, 223.0, 223.0, 223.0, 0.04217688987614053, 0.029902755908279323, 0.024960151625919105], "isController": false}, {"data": ["getQuerySummary", 3, 3, 100.0, 30132.333333333332, 30112, 30143, 30143.0, 30143.0, 30143.0, 0.02968856693287415, 0.008349909449870855, 0.020178947837187898], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, 100.0, 30143.666666666668, 30114, 30165, 30165.0, 30165.0, 30165.0, 0.029669481970844788, 0.008344541804300096, 0.02083238040726309], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 798.3333333333334, 688, 888, 888.0, 888.0, 888.0, 0.04188189306156638, 0.022495157406114758, 0.026257983735864864], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 1, 33.333333333333336, 29837.0, 29271, 30138, 30138.0, 30138.0, 30138.0, 0.02969032985956474, 0.010843929069801965, 0.020847018719752974], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 29869.666666666668, 29582, 30053, 30053.0, 30053.0, 30053.0, 0.029841541415085895, 0.012152268330166813, 0.0209531916771941], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 70.33333333333333, 45, 121, 121.0, 121.0, 121.0, 0.0413371179761347, 0.02123371489789732, 0.02365581165431146], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, 100.0, 30321.0, 30163, 30602, 30602.0, 30602.0, 30602.0, 0.029534826482894412, 0.24451798240216588, 0.23549986155550084], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 16, 84.21052631578948, 30.76923076923077], "isController": false}, {"data": ["Assertion failed", 3, 15.789473684210526, 5.769230769230769], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52, 19, "500\/Internal Server Error", 16, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getQuerySummary", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
