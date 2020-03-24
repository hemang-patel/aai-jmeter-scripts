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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4107142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.5, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 24, 46.15384615384615, 14194.769230769232, 25, 30500, 30173.9, 30365.55, 30500.0, 0.4261072643094194, 0.5020412304871553, 0.45896476932847136], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 3, 100.0, 30142.0, 30138, 30148, 30148.0, 30148.0, 30148.0, 0.02887475095527301, 0.008121023706170533, 0.021035707238900064], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 3, 100.0, 30135.0, 30130, 30144, 30144.0, 30144.0, 30144.0, 0.028877808366863676, 0.00812188360318041, 0.020220106053751227], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1064.6666666666667, 621, 1889, 1889.0, 1889.0, 1889.0, 0.040203159968373516, 0.07027700814784042, 0.08711993356427816], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 734.3333333333334, 612, 815, 815.0, 815.0, 815.0, 0.0402808920874901, 0.019629067530915582, 0.02513622074600212], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 2309.0, 2309, 2309, 2309.0, 2309.0, 2309.0, 0.43308791684711995, 3.288338431139021, 0.7219541738847985], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 2309.0, 2309, 2309, 2309.0, 2309.0, 2309.0, 0.43308791684711995, 3.288338431139021, 0.7219541738847985], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 201.0, 154, 285, 285.0, 285.0, 285.0, 0.04061573453555908, 0.1551780196106305, 0.024353575200032493], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 167.66666666666669, 25, 451, 451.0, 451.0, 451.0, 0.040919320739275726, 0.011508558957921298, 0.02137874667530519], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 172.33333333333334, 74, 336, 336.0, 336.0, 336.0, 0.04111278607646978, 0.01718385980539948, 0.021720719987666164], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 664.6666666666666, 440, 1031, 1031.0, 1031.0, 1031.0, 0.040364898684104304, 0.02160152781141519, 0.021956297428755954], "isController": false}, {"data": ["getScoredTransactionList", 3, 3, 100.0, 30138.333333333332, 30137, 30140, 30140.0, 30140.0, 30140.0, 0.028874195131810703, 0.00812086738082176, 0.019907404065486675], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 184.66666666666666, 124, 274, 274.0, 274.0, 274.0, 0.04064269650743762, 0.022305854919121036, 0.0254810655837646], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 199.33333333333334, 151, 230, 230.0, 230.0, 230.0, 0.04061078622482131, 0.028792412889863547, 0.0240333363791423], "isController": false}, {"data": ["getQuerySummary", 3, 3, 100.0, 30282.666666666668, 30113, 30426, 30426.0, 30426.0, 30426.0, 0.02879327389121901, 0.008098108281905346, 0.019570428347937922], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 3, 100.0, 30142.0, 30137, 30149, 30149.0, 30149.0, 30149.0, 0.028883925132866056, 0.008123603943618577, 0.02028080290090888], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 1440.6666666666667, 975, 1702, 1702.0, 1702.0, 1702.0, 0.039782522211908235, 0.02136756564116165, 0.024941776621137782], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 3, 100.0, 30133.666666666668, 30119, 30154, 30154.0, 30154.0, 30154.0, 0.028888931687306205, 0.008125012037054869, 0.020284318245286287], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 3, 100.0, 30136.333333333332, 30111, 30155, 30155.0, 30155.0, 30155.0, 0.02888559379152304, 0.008124073253865854, 0.020281974546977603], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 60.0, 49, 71, 71.0, 71.0, 71.0, 0.041324021653787346, 0.02122698768544155, 0.02364831707921815], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 3, 100.0, 30338.333333333332, 30182, 30500, 30500.0, 30500.0, 30500.0, 0.028786642997649093, 0.2323546874250348, 0.22953412116777813], "isController": false}]}, function(index, item){
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
