
var savePlot=null;  // point to the viewer node
var saveTrace=[];   // key/label for the traces
var saveTracking=[];// state of traces being shown (true/false)
var saveColor=[];

var saveX=null;
var saveY=null;

var displaySubplots=13;

function makeplot(url) {
  Plotly.d3.csv(url, function(data){
    var r=processData(data)
    saveX=r[0];
    saveY=r[1];
    processForPlotting();
    addLineChart();
//DEBUG,  makePlotly();
  } );
};

function getColor(idx) {
  var stockColor=[
                'rgba(0, 128, 0, .8)',
                'rgba(152, 0, 0, .8)',
                'rgba(0, 0, 255, .8)',
                'rgba(255, 168, 0, .8)'];
  var tmp=(idx % 4);
  return stockColor[tmp];
}

function processForPlotting() {
   saveTrace=dataType;
   var cnt=saveTrace.length;
   for(var i=0;i<cnt;i++) {
     saveColor[i]=getColor(i);
     saveTracking[i]=true; //
   }
}

// initial set
function addLineChart() {
  // returns, Y-array, array-length, array-names
  var _y=saveY;
  var _keys=saveTrace;
  var _colors=saveColor;

  var _data=getLinesAt(_y,_keys,_colors);
  var _layout=getLinesDefaultLayout();
  savePlot=addAPlot('#myViewer',_data, _layout,1000,1000);
}

function updateLineChart() {
  $('#myViewer').empty();
  var cnt=saveTracking.length; 
  var _y=[];
  var _colors=[];
  var _keys=[];

  for(var i=0;i<cnt;i++) {
     if(saveTracking[i]==true) {
       _y[i]=saveY[i];
       _colors[i]=getColor(i);
       _keys[i]=saveTrace[i];
     }
  }
  var _data=getLinesAt(_y,_keys,_colors);
  var _layout=getLinesDefaultLayout();
  savePlot=addAPlot('#myViewer',_data, _layout,1000,1000);
}

function makeOne0(y,trace,color) {
  var x=saveX;
  var marker_val = { 'size':10, 'color':color};
  var t= { "x":x, "y":y, "yaxis":'y1', "name":trace, "marker": marker_val,  "type":"scatter" };
  return t;
}

function makeOneN(y,trace,color,yidx) {
  var x=saveX;
  var ystring="y"+yidx;
  var marker_val = { 'size':10, 'color':color};
  var t= { "x":x, "y":y, "yaxis":ystring, "name":trace, "marker": marker_val,  "type":"scatter" };
  return t;
}

function getLinesAt(y,trace,color) {
  var cnt=y.length;
  var data=[];
  var first=makeOne0(y[0],trace[0],color[0]); 
  data.push(first);
  var next;
  for (var i=1;i<displaySubplots; i++) {
    next=makeOneN(y[i],trace[i],color[i],i+1); 
    data.push(next);
  }
  return data;
}


function getLinesDefaultLayout(keys){

  var p= {
        "width": 1000,
        "height": 1000,
        "xaxis": { "ticks": "", "autotick" : true,
                   "ticks": '', "showticklabels": false },
        "hovermode": "closest"};

  var gap=0.03;
  var inside=(Math.round((1/displaySubplots)*100)/100)-gap;
  var lval=0;
  var hval=inside;
  for(var i=1;i<displaySubplots+1;i++) {
     var nm='yaxis'+i;
     p[nm]= { 'type':'log', 'domain': [lval, hval] };
     lval= Math.round((hval+gap)*100)/100;
     hval= Math.round((lval+inside)*100)/100;
  }
  return p;
}

function addAPlot(divname, data, layout, w, h) {
  var d3 = Plotly.d3;
  var gd3 = d3.select(divname)
    .append('div')
    .style({
        width: w,
        height: h,
        visibility: 'inherit'
    });

  var gd = gd3.node();
  Plotly.newPlot(gd, data, layout);
  return gd;
}

function toggleTrace(idx) {
  saveTracking[idx] = !saveTracking[idx];
  // rebuilt the plot
  updateLineChart();
}


//====================DEBUG==========================

function makePlotly( x, y ){
/*
  var traces = [
        { x: x, y: y[1] },
        { x: x, y: y[2], yaxis: 'y2'},
        { x: x, y: y[3], yaxis: 'y3'},
  ];
*/
  var traces=[];
  traces.push( { "x": x, "y": y[0], "yaxis": 'y', "name":"first" });
  traces.push( { "x": x, "y": y[1], "yaxis": 'y2', "name":"second"});
  traces.push( { "x": x, "y": y[2], "yaxis": 'y3', "name":"third" });

  var layouts= { 
                "width": 1000,
                "height": 1000,
                "xaxis": { "ticks": "",
"autotick" : true,
"ticks": '',
"showticklabels": false },
                "margin": {"b": 100},
                "hovermode": "closest",
                "yaxis": { domain: [0, 0.2] },
                "yaxis2": { domain: [ 0.25, 0.45] },
                "yaxis3": { domain: [ 0.5, 75] },
                "yaxis4": { domain: [ 0.8, 1.0] }
               };  

  Plotly.newPlot('myViewer', traces, layouts);
};
