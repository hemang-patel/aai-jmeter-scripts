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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4017857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "getTransactionSummaryByPeriod"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByJournal"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "(Parent) Generic AAI APIs"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "getLookupList - USER"], "isController": false}, {"data": [0.5, 500, 1500, "(Parent) Collab Login"], "isController": true}, {"data": [0.5, 500, 1500, "Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login"], "isController": false}, {"data": [1.0, 500, 1500, "getQueryList"], "isController": false}, {"data": [1.0, 500, 1500, "getAppInfo"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLatestDataset"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLoginInfo"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionList"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getLookupList - ACCOUNT"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "getAllSliceStatuses"], "isController": false}, {"data": [0.0, 500, 1500, "getQuerySummary"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByEnteredBy"], "isController": false}, {"data": [0.0, 500, 1500, "getLookupList - JOURNAL"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "getScoredTransactionSummaryByRiskLevel"], "isController": false}, {"data": [0.0, 500, 1500, "getScoredTransactionSummaryByRiskLevel - Second call"], "isController": false}, {"data": [1.0, 500, 1500, "getDatasetMetadata"], "isController": false}, {"data": [0.0, 500, 1500, "(Parent) {Results Page Widget} Data-aggregator APIs"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52, 0, 0.0, 1547.2500000000002, 25, 3626, 3512.2, 3554.0999999999995, 3626.0, 1.2047076267259753, 1.8203646267723101, 1.2986896632610507], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["getTransactionSummaryByPeriod", 3, 0, 0.0, 2827.6666666666665, 2601, 2981, 2981.0, 2981.0, 2981.0, 0.10278196519117445, 0.13279349604289434, 0.07497864062285871], "isController": false}, {"data": ["getScoredTransactionSummaryByJournal", 3, 0, 0.0, 3544.0, 3508, 3610, 3610.0, 3610.0, 3610.0, 0.0996446009233733, 0.06655947952303451, 0.0698679916630684], "isController": false}, {"data": ["(Parent) Generic AAI APIs", 3, 0, 0.0, 1020.0, 696, 1618, 1618.0, 1618.0, 1618.0, 0.1075037626316921, 0.18676679074392605, 0.23295981374973124], "isController": true}, {"data": ["getLookupList - USER", 3, 0, 0.0, 1497.3333333333333, 1345, 1769, 1769.0, 1769.0, 1769.0, 0.107461403445929, 0.052366445624529856, 0.06705843437690295], "isController": false}, {"data": ["(Parent) Collab Login", 1, 0, 0.0, 1290.0, 1290, 1290, 1290.0, 1290.0, 1290.0, 0.7751937984496124, 5.841963420542635, 1.2922420058139534], "isController": true}, {"data": ["Login_111 \/qa-ihub-clean\/CWCoreService\/restricted\/SessionService.svc\/Login", 1, 0, 0.0, 1290.0, 1290, 1290, 1290.0, 1290.0, 1290.0, 0.7751937984496124, 5.841963420542635, 1.2922420058139534], "isController": false}, {"data": ["getQueryList", 3, 0, 0.0, 228.0, 128, 369, 369.0, 369.0, 369.0, 0.11214114832535886, 0.4398400703685706, 0.06724088385915072], "isController": false}, {"data": ["getAppInfo", 3, 0, 0.0, 48.666666666666664, 25, 94, 94.0, 94.0, 94.0, 0.11410748925487808, 0.032092731352934466, 0.05961670581187479], "isController": false}, {"data": ["getLatestDataset", 3, 0, 0.0, 427.6666666666667, 59, 1093, 1093.0, 1093.0, 1093.0, 0.10993843447669306, 0.044662489006156554, 0.05808270805848725], "isController": false}, {"data": ["getLoginInfo", 3, 0, 0.0, 501.3333333333333, 458, 568, 568.0, 568.0, 568.0, 0.1121746933891714, 0.060140533858061625, 0.061016898650164526], "isController": false}, {"data": ["getScoredTransactionList", 3, 0, 0.0, 2105.0, 1852, 2265, 2265.0, 2265.0, 2265.0, 0.10425716768027801, 0.09458487185056473, 0.07198224370112946], "isController": false}, {"data": ["getLookupList - ACCOUNT", 3, 0, 0.0, 511.0, 157, 1206, 1206.0, 1206.0, 1206.0, 0.10793696481254947, 0.059238842016262505, 0.06767141739224293], "isController": false}, {"data": ["getAllSliceStatuses", 3, 0, 0.0, 572.3333333333334, 216, 1282, 1282.0, 1282.0, 1282.0, 0.11196118678857996, 0.06910104497107669, 0.06636761755924613], "isController": false}, {"data": ["getQuerySummary", 3, 0, 0.0, 2950.0, 2726, 3126, 3126.0, 3126.0, 3126.0, 0.10149193139145438, 0.04826813533949051, 0.06908191033187862], "isController": false}, {"data": ["getScoredTransactionSummaryByEnteredBy", 3, 0, 0.0, 1939.0, 1697, 2191, 2191.0, 2191.0, 2191.0, 0.10522254568412191, 0.07377908964960893, 0.07398460243414823], "isController": false}, {"data": ["getLookupList - JOURNAL", 3, 0, 0.0, 1775.0, 1555, 1966, 1966.0, 1966.0, 1966.0, 0.10664012512441348, 0.05727741095549552, 0.06685835969714204], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel", 3, 0, 0.0, 1746.6666666666667, 1491, 2061, 2061.0, 2061.0, 2061.0, 0.1061608691036484, 0.04323152579709119, 0.07464436108850278], "isController": false}, {"data": ["getScoredTransactionSummaryByRiskLevel - Second call", 3, 0, 0.0, 2117.3333333333335, 1776, 2652, 2652.0, 2652.0, 2652.0, 0.10517827717981978, 0.04283138826561021, 0.0739534761420608], "isController": false}, {"data": ["getDatasetMetadata", 3, 0, 0.0, 42.333333333333336, 42, 43, 43.0, 43.0, 43.0, 0.11049316783912194, 0.05675723269861147, 0.06323144175168502], "isController": false}, {"data": ["(Parent) {Results Page Widget} Data-aggregator APIs", 3, 0, 0.0, 3555.6666666666665, 3517, 3626, 3626.0, 3626.0, 3626.0, 0.09961482268561563, 1.0928770732334971, 0.7950702595796254], "isController": false}]}, function(index, item){
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
