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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8035714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 523.2884615384614, 26, 3162, 1274.0000000000005, 3130.7999999999997, 3162.0, 1.5801628783274582, 2.3890289310350066, 1.7020106243162756], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 483.0, 400, 625, 625.0, 625.0, 625.0, 0.14884644008930786, 0.18809306003473084, 0.10843695733068717], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 487.6666666666667, 407, 531, 531.0, 531.0, 531.0, 0.14812620352540365, 0.09836505702858836, 0.1037172733669086], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1181.3333333333333, 616, 1626, 1626.0, 1626.0, 1626.0, 0.1353607363624058, 0.2350306535667554, 0.2933256581915806], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 1234.6666666666667, 255, 3149, 3149.0, 3149.0, 3149.0, 0.149655791679138, 0.07292796879676744, 0.09338872156539958], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1310.0, 1310, 1310, 1310.0, 1310.0, 1310.0, 0.7633587786259541, 5.88695729961832, 1.2725131202290076], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1310.0, 1310, 1310, 1310.0, 1310.0, 1310.0, 0.7633587786259541, 5.88695729961832, 1.2725131202290076], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 134.66666666666666, 124, 155, 155.0, 155.0, 155.0, 0.1508219797898547, 0.5822749610376553, 0.09043427303805743], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 146.33333333333334, 26, 385, 385.0, 385.0, 385.0, 0.1414360473339305, 0.03977888831266796, 0.07389480988637971], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 58.666666666666664, 57, 60, 60.0, 60.0, 60.0, 0.1436643999616895, 0.058363662484436356, 0.07590082068288477], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 923.0, 484, 1467, 1467.0, 1467.0, 1467.0, 0.13634504385765578, 0.07283275292005635, 0.07416424748897878], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 270.0, 261, 287, 287.0, 287.0, 287.0, 0.14987260828295948, 0.1403592102962482, 0.1033301381325873], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 1154.3333333333333, 159, 3121, 3121.0, 3121.0, 3121.0, 0.15079923595053785, 0.08276286191816629, 0.09454405222680205], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 284.0, 150, 524, 524.0, 524.0, 524.0, 0.15065535077587505, 0.10254568309646964, 0.08915736579119168], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 512.6666666666666, 417, 679, 679.0, 679.0, 679.0, 0.14891293557033655, 0.06820328787352328, 0.10121426089546312], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 262.3333333333333, 211, 339, 339.0, 339.0, 339.0, 0.15041363750313363, 0.10561270055151667, 0.10561270055151667], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 339.3333333333333, 297, 377, 377.0, 377.0, 377.0, 0.14946193702670385, 0.08027740758270227, 0.0937056284874452], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 271.0, 234, 309, 309.0, 309.0, 309.0, 0.14987260828295948, 0.060739387145925965, 0.10523281772992957], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 605.3333333333334, 289, 1190, 1190.0, 1190.0, 1190.0, 0.14952898370134077, 0.060600125230523855, 0.1049915422668594], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 53.333333333333336, 39, 76, 76.0, 76.0, 76.0, 0.1438021282714984, 0.07400754062410124, 0.08229301481161921], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 1413.3333333333333, 539, 3162, 3162.0, 3162.0, 3162.0, 0.14792170011340663, 1.6196752040086781, 1.1794733217050442], "isController": false}]}, function(index, item){
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
