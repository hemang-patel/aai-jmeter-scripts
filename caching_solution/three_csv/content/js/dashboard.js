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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8839285714285714, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [1.0, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.0, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [1.0, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [1.0, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [1.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 329.5961538461538, 24, 1692, 545.1000000000001, 1296.4499999999998, 1692.0, 1.8177369175376656, 2.7395775072534696, 1.9579042061383578], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 391.6666666666667, 373, 418, 418.0, 418.0, 418.0, 0.15717504060355217, 0.1986176782626919, 0.11450447293969718], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 509.0, 498, 515, 515.0, 515.0, 515.0, 0.1558765457757456, 0.10351176867920607, 0.10914402668086876], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 576.0, 562, 583, 583.0, 583.0, 583.0, 0.17239397770371223, 0.29933251206757844, 0.37357640285599353], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 177.66666666666666, 166, 185, 185.0, 185.0, 185.0, 0.1590583744234134, 0.07750989144265945, 0.0992561535708605], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1692.0, 1692, 1692, 1692.0, 1692.0, 1692.0, 0.5910165484633569, 4.513427157210402, 0.9852199689716312], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1692.0, 1692, 1692, 1692.0, 1692.0, 1692.0, 0.5910165484633569, 4.513427157210402, 0.9852199689716312], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 171.33333333333334, 136, 234, 234.0, 234.0, 234.0, 0.1591005515485787, 0.6096782854263895, 0.09539818227619855], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 25.0, 24, 27, 27.0, 27.0, 27.0, 0.17806267806267806, 0.05008012820512821, 0.09303079371438747], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 56.0, 54, 58, 58.0, 58.0, 58.0, 0.17775671031581441, 0.07221366356579961, 0.09391248074302305], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 453.0, 445, 459, 459.0, 459.0, 459.0, 0.17358097552508245, 0.09272343126193369, 0.09441855797604581], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 285.0, 277, 297, 297.0, 297.0, 297.0, 0.1577784790154623, 0.14776324353108236, 0.1087808654149574], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 142.0, 119, 159, 159.0, 159.0, 159.0, 0.15910898965791567, 0.08732348846459825, 0.09975387828162291], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 212.33333333333334, 145, 297, 297.0, 297.0, 297.0, 0.15867978419549347, 0.10800762654712791, 0.09390620041256745], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 721.3333333333334, 436, 1287, 1287.0, 1287.0, 1287.0, 0.15668250900924427, 0.07176181320833551, 0.10649514284222072], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 298.6666666666667, 278, 314, 314.0, 314.0, 314.0, 0.15762925598991173, 0.11067913579760404, 0.11067913579760404], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 379.0, 375, 386, 386.0, 386.0, 386.0, 0.15714210884710073, 0.08440249986904824, 0.09852073621077995], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 220.66666666666666, 206, 229, 229.0, 229.0, 229.0, 0.15842839036755385, 0.06420681836185044, 0.111240246752218], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 253.66666666666666, 213, 276, 276.0, 276.0, 276.0, 0.1578199800094692, 0.06396024580461887, 0.11081305236993003], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 42.0, 39, 44, 44.0, 44.0, 44.0, 0.17842274295230165, 0.09182498587486618, 0.10210520250981325], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 810.6666666666666, 558, 1314, 1314.0, 1314.0, 1314.0, 0.15569048731122528, 1.700279999610774, 1.241418778218901], "isController": false}]}, function(index, item){
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
