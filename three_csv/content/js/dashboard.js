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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5178571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 2029.8461538461538, 26, 5066, 5000.5, 5024.4, 5066.0, 1.3781040468555377, 2.0772496057827365, 1.4843708590623592], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 3840.3333333333335, 3604, 4252, 4252.0, 4252.0, 4252.0, 0.11844131232974062, 0.1494396245410399, 0.08628634667772118], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 4802.333333333333, 4750, 4884, 4884.0, 4884.0, 4884.0, 0.11355893708834885, 0.07541023166023167, 0.07951343544174427], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 877.0, 593, 1440, 1440.0, 1440.0, 1440.0, 0.13197254970966038, 0.22914764978884392, 0.28598348418528946], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 181.0, 171, 186, 186.0, 186.0, 186.0, 0.13729977116704806, 0.06690682208237986, 0.08567827517162471], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1364.0, 1364, 1364, 1364.0, 1364.0, 1364.0, 0.7331378299120235, 5.618814149560117, 1.2221350348240467], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1364.0, 1364, 1364, 1364.0, 1364.0, 1364.0, 0.7331378299120235, 5.618814149560117, 1.2221350348240467], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 160.66666666666666, 138, 183, 183.0, 183.0, 183.0, 0.13762099178861414, 0.5272335456901693, 0.08251883687325107], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 26.333333333333332, 26, 27, 27.0, 27.0, 27.0, 0.13796909492273732, 0.03880380794701987, 0.07208346267935982], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 65.66666666666667, 61, 70, 70.0, 70.0, 70.0, 0.13772207684891888, 0.05594959371987329, 0.07276137067896983], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 599.3333333333334, 457, 878, 878.0, 878.0, 878.0, 0.132772737331268, 0.07092449933613632, 0.07222110809913698], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 5009.0, 4990, 5027, 5027.0, 5027.0, 5027.0, 0.11250281257031426, 0.10536152075676891, 0.07756541569789245], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 164.0, 115, 200, 200.0, 200.0, 200.0, 0.13779798814937302, 0.07562741146479261, 0.08639287928896237], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 144.33333333333334, 136, 156, 156.0, 156.0, 156.0, 0.13765888129215803, 0.09369945337952554, 0.08146609576469509], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 3644.3333333333335, 3473, 3975, 3975.0, 3975.0, 3975.0, 0.11921793037672866, 0.05460274350262279, 0.08103093705293275], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 3562.6666666666665, 3524, 3627, 3627.0, 3627.0, 3627.0, 0.11909487892020643, 0.08362228314807463, 0.08362228314807463], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 240.33333333333334, 223, 260, 260.0, 260.0, 260.0, 0.1367178599097662, 0.07343244428747209, 0.08571568951374015], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 3389.3333333333335, 3348, 3465, 3465.0, 3465.0, 3465.0, 0.12005762766127741, 0.048656167460380984, 0.08429827567232272], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 3682.6666666666665, 3355, 4302, 4302.0, 4302.0, 4302.0, 0.11995201919232307, 0.04861336715313874, 0.08422412285085965], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 185.66666666666669, 43, 466, 466.0, 466.0, 466.0, 0.13817243920412675, 0.07111022994196757, 0.0790713372789241], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 5031.333333333333, 5005, 5066, 5066.0, 5066.0, 5066.0, 0.11233851338700618, 1.2265083785807902, 0.8957460564501031], "isController": false}]}, function(index, item){
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
