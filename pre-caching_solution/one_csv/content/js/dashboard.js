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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6160714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.5, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.5, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 1105.4038461538462, 25, 9129, 1917.5000000000002, 4713.649999999961, 9129.0, 1.2342162726668566, 1.8478939701414603, 1.3293877723583025], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 1203.0, 1163, 1228, 1228.0, 1228.0, 1228.0, 0.14203200454502415, 0.1751820524808257, 0.10347253456112111], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 1529.6666666666667, 1516, 1557, 1557.0, 1557.0, 1557.0, 0.13965180150823947, 0.09123735860255097, 0.0977835367982497], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 889.3333333333334, 587, 1460, 1460.0, 1460.0, 1460.0, 0.15243127889842994, 0.26467071668106296, 0.3303173905035313], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 149.0, 137, 169, 169.0, 169.0, 169.0, 0.14927601134497684, 0.0727429000597104, 0.09315172973578145], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 2341.0, 2341, 2341, 2341.0, 2341.0, 2341.0, 0.42716787697565145, 3.2438060657838528, 0.712085513669372], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 2341.0, 2341, 2341, 2341.0, 2341.0, 2341.0, 0.42716787697565145, 3.2438060657838528, 0.712085513669372], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 3142.6666666666665, 145, 9120, 9120.0, 9120.0, 9120.0, 0.10312822275696115, 0.3935120531110347, 0.06183664919216226], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 145.0, 25, 381, 381.0, 381.0, 381.0, 0.16035920461834507, 0.04510102629890956, 0.08378142038165491], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 98.33333333333333, 63, 139, 139.0, 139.0, 139.0, 0.16314100821143074, 0.06627603458589375, 0.08619070843982816], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 592.6666666666666, 454, 868, 868.0, 868.0, 868.0, 0.15347623676267458, 0.08198388819256151, 0.08348267956719702], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 1873.6666666666667, 1820, 1943, 1943.0, 1943.0, 1943.0, 0.13746334310850442, 0.12967733344024926, 0.09477453147910557], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 144.33333333333334, 127, 163, 163.0, 163.0, 163.0, 0.14930572836311154, 0.08194318294928582, 0.09360769297765391], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 164.66666666666666, 147, 177, 177.0, 177.0, 177.0, 0.14916467780429596, 0.10153103557577567, 0.08827519018496421], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 1202.6666666666667, 1173, 1229, 1229.0, 1229.0, 1229.0, 0.14188422247446084, 0.06581543522985245, 0.09643693246311011], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 1213.0, 1163, 1273, 1273.0, 1273.0, 1273.0, 0.1417166611554632, 0.09549267206764608, 0.09950613219802541], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 242.66666666666666, 189, 304, 304.0, 304.0, 304.0, 0.1488833746898263, 0.07996665632754343, 0.09334289702233252], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 1152.3333333333333, 1133, 1165, 1165.0, 1165.0, 1165.0, 0.14218683349921798, 0.05720798379070098, 0.09983626297454856], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 1167.6666666666667, 1143, 1202, 1202.0, 1202.0, 1202.0, 0.14215988248116382, 0.05719714021703075, 0.09981733935933279], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 53.333333333333336, 41, 72, 72.0, 72.0, 72.0, 0.16449172058339728, 0.08465540697993201, 0.09413295728698322], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 4305.333333333334, 1824, 9129, 9129.0, 9129.0, 9129.0, 0.10306090899721736, 1.1173989895736713, 0.8217698456662887], "isController": false}]}, function(index, item){
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
