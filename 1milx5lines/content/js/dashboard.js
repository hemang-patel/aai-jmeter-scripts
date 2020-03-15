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

    var data = {"OkPercent": 53.84615384615385, "KoPercent": 46.15384615384615};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4017857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.5, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 24, 46.15384615384615, 14282.961538461537, 26, 30259, 30178.6, 30208.85, 30259.0, 0.4282161503368085, 0.5048556468946094, 0.46123627340777706], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, 100.0, 30169.333333333332, 30138, 30205, 30205.0, 30205.0, 30205.0, 0.02854967643700038, 0.008029596497906357, 0.020798885373049105], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, 100.0, 30149.666666666668, 30132, 30166, 30166.0, 30166.0, 30166.0, 0.02855402421381253, 0.008030819310134775, 0.019993393907523034], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1016.3333333333334, 609, 1745, 1745.0, 1745.0, 1745.0, 0.03965840890463475, 0.06932475775321895, 0.08593946226502393], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 926.3333333333333, 506, 1462, 1462.0, 1462.0, 1462.0, 0.03926495994974086, 0.01913399903800848, 0.024502255281137114], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 2584.0, 2584, 2584, 2584.0, 2584.0, 2584.0, 0.38699690402476783, 2.9629450464396285, 0.6451208155959752], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 2584.0, 2584, 2584, 2584.0, 2584.0, 2584.0, 0.38699690402476783, 2.9629450464396285, 0.6451208155959752], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 199.33333333333334, 152, 235, 235.0, 235.0, 235.0, 0.03992228461927448, 0.15206075922204776, 0.023937776129135283], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 27.666666666666668, 26, 31, 31.0, 31.0, 31.0, 0.04024198849079129, 0.01131805926303505, 0.021024867033763026], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 260.3333333333333, 75, 626, 626.0, 626.0, 626.0, 0.0402160944810113, 0.016809070740110194, 0.021246979603737417], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 593.0, 450, 874, 874.0, 874.0, 874.0, 0.03978885381575108, 0.02129325379983554, 0.02164296052282554], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, 100.0, 30139.0, 30116, 30158, 30158.0, 30158.0, 30158.0, 0.028554295993832274, 0.008030895748265326, 0.01968684860512264], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 199.0, 181, 226, 226.0, 226.0, 226.0, 0.03993291270665283, 0.021916305606580942, 0.025036064411788194], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 216.66666666666666, 190, 243, 243.0, 243.0, 243.0, 0.03991856612510479, 0.028613503452955966, 0.02362368268731787], "isController": false}, {"data": ["getQuerySummary", 3, 3, 100.0, 30147.666666666668, 30143, 30157, 30157.0, 30157.0, 30157.0, 0.028551034975017844, 0.008029978586723769, 0.019405781584582442], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, 100.0, 30166.666666666668, 30123, 30193, 30193.0, 30193.0, 30193.0, 0.02855456777902572, 0.008030972187850984, 0.020049545149530754], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 2890.3333333333335, 1515, 4362, 4362.0, 4362.0, 4362.0, 0.03782911328558459, 0.020318371393624534, 0.023717080790376273], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 3, 100.0, 30138.666666666668, 30117, 30157, 30157.0, 30157.0, 30157.0, 0.02855402421381253, 0.008030819310134775, 0.020049163486065637], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 3, 100.0, 30144.0, 30134, 30155, 30155.0, 30155.0, 30155.0, 0.02855130669813655, 0.008030055008850906, 0.020047255386679865], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 135.33333333333334, 43, 219, 219.0, 219.0, 219.0, 0.04050660257621992, 0.02080710249520672, 0.023180536239907106], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, 100.0, 30207.0, 30146, 30259, 30259.0, 30259.0, 30259.0, 0.028543700405320546, 0.2302822496241746, 0.22759698614203344], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 21, 87.5, 40.38461538461539], "isController": false}, {"data": ["Assertion failed", 3, 12.5, 5.769230769230769], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52, 24, "500\/Internal Server Error", 21, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["getQuerySummary", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
