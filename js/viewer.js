//
// Usage example:
//  http://localhost/iostat-viewer/view.html?
//     http://localhost/data/iostat-data/karlcz-iostat-log.csv
//  or
//  http://localhost/iostat-viewer/view.html?
//     url=http://localhost/data/iostat-data/karlcz-iostat-log.csv&points=50
//
//

var infoType = ['when','device'];
var dataType = [ 
'r/s', 'w/s', 'rkB/s', 'wkB/s', 'avgrq-sz', 'avgqu-sz', 'await',
'r_await', 'w_await', 'svctm', 'util', 'rrqm/s', 'wrqm/s' ];

var displayPoints=20;

function getDay(date) {
  var d = new Date(date);
/*
  window.console.log(d);
  window.console.log(d.getFullYear());
  window.console.log(d.getMonth()); // 0-11
  window.console.log(d.getDate());
*/
  var label=(d.getFullYear()).toString()+"/"+(d.getMonth()+1).toString()+"/"+(d.getDate()).toString();
//  window.console.log("label--",label);
  return d;
}

function processData(allRows) {
  var _all=allRows;

  var x = [];
  var y = [];
  
  for (var i=0; i < dataType.length; i++) { 
    y.push([]);
  }

  var totalDisplayCount=allRows.length;
  for (var i=0; i< displayPoints; i++) {
    var row = allRows[i];
    x.push( row['when'] );
    var dd=getDay(row['when']);
    for(var j=0;j<dataType.length;j++) {
      var v=row[dataType[j]];
      y[j].push(Math.log10(v));
//      y[j].push( row [ dataType[j]] );
    }
  }
  return [x,y];
}

function processArgs(args) {
  var url="";
  var params = args[1].split('&');
  for (var i=0; i < params.length; i++) {
    var param = unescape(params[i]);
    if (param.indexOf('=') == -1) {
      url=param.replace(new RegExp('/$'),'').trim();
      } else {
        var kvp = param.split('=');
        switch (kvp[0].trim()) {
          case 'url':
             {
             url=kvp[1].replace(new RegExp('/$'),'').trim();
             break;
             }
          case 'points':
             {
             var t=parseInt(kvp[1]);
             if(!isNaN(t))
               displayPoints=t;
             }
       }
    }
  }
  return url;
}

function displayInitial() {
   addLineChart();
}


/*****MAIN*****/
jQuery(document).ready(function() {
  var args=document.location.href.split('?');
  if (args.length === 2) {
    var url=processArgs(args);
    makeplot(url);
    } else {
      alertify.error("Usage: view.html?http://datapath/data.csv");
      return;
  }
});

