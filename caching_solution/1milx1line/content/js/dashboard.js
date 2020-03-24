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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35714285714285715, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.5, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 2065.2692307692305, 25, 5333, 4647.4, 5252.9, 5333.0, 1.00283493722639, 1.5313723410410198, 1.0801644191271478], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 3059.0, 2279, 3519, 3519.0, 3519.0, 3519.0, 0.08650519031141868, 0.11550920919838524, 0.06302038278546712], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 5059.0, 4646, 5327, 5327.0, 5327.0, 5327.0, 0.08375910880308234, 0.05758438730211911, 0.058647735363095733], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 2311.0, 601, 4668, 4668.0, 4668.0, 4668.0, 0.08730574471800244, 0.151676679544264, 0.18919086672778068], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 1792.0, 1498, 2142, 2142.0, 2142.0, 2142.0, 0.09184704405596546, 0.04475749510149099, 0.05731470815601752], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1289.0, 1289, 1289, 1289.0, 1289.0, 1289.0, 0.7757951900698216, 5.916195936772692, 1.2932445209464702], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1289.0, 1289, 1289, 1289.0, 1289.0, 1289.0, 0.7757951900698216, 5.916195936772692, 1.2932445209464702], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 156.33333333333334, 121, 196, 196.0, 196.0, 196.0, 0.09584970765839164, 0.3762537840665836, 0.05747238330298093], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 384.0, 25, 1099, 1099.0, 1099.0, 1099.0, 0.08879680331508065, 0.024974100932366437, 0.04639286110700015], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 405.0, 61, 1092, 1092.0, 1092.0, 1092.0, 0.08871015435566858, 0.03603850020699036, 0.04686737647111006], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 1477.3333333333335, 467, 3460, 3460.0, 3460.0, 3460.0, 0.0904895484571532, 0.04842604741652339, 0.049221365713510094], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 1767.0, 784, 2946, 2946.0, 2946.0, 2946.0, 0.09165062780680047, 0.08663848409861609, 0.0631888117496105], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 685.0, 155, 1208, 1208.0, 1208.0, 1208.0, 0.09412059986195645, 0.05165603234611282, 0.05900920421032817], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 519.0, 128, 1188, 1188.0, 1188.0, 1188.0, 0.09586808551433228, 0.05916858402837696, 0.056734433419614615], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 3575.0, 3311, 3762, 3762.0, 3762.0, 3762.0, 0.08692880530845237, 0.04091766031120512, 0.05908442235808872], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 2205.3333333333335, 1751, 2830, 2830.0, 2830.0, 2830.0, 0.09108574204517852, 0.06573472985487006, 0.06395571145555015], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 3701.6666666666665, 3437, 4004, 4004.0, 4004.0, 4004.0, 0.08678797697225678, 0.046614636069083226, 0.054411993375184424], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 3049.6666666666665, 2546, 3866, 3866.0, 3866.0, 3866.0, 0.08563354551422944, 0.035039507393029426, 0.06012746018040133], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 2423.6666666666665, 1480, 3023, 3023.0, 3023.0, 3023.0, 0.09186110600771634, 0.03758769864964174, 0.06450013205033989], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 44.666666666666664, 42, 47, 47.0, 47.0, 47.0, 0.08883361463977969, 0.04571808097183974, 0.050836424002842676], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 5064.666666666667, 4648, 5333, 5333.0, 5333.0, 5333.0, 0.08373806732540613, 0.9290509598475967, 0.6676966012811925], "isController": false}]}, function(index, item){
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
