//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");
var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { hsl } = require("./lib/colors");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);
var dot = require("./lib/dot");
var popupTemplate = dot.compile(require("./_popup.html"));

var data = require("./lottery.geo.json");

var commafy = s => (s*1).toLocaleString().replace(/1.0+$/, "");

data.features.forEach(function(f) {
	["winDraw", "winScratch"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
	});
	["winDrawTix", "winScratchTix"].forEach(function(prop) {
		f.properties[prop] = commafy ((f.properties[prop]));
	});
});

var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

    var all = "winDraw";
  var max;


  var onEachFeature = function(feature, layer) {
  	layer.bindPopup(ich.popup(feature.properties))
    var focused = false;
 		var popup = false;

  layer.on({
  	     mouseover: function(e) {
        layer.setStyle({ weight: 2.5, fillOpacity: .7 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1.5, fillOpacity: 0.4
         });
      },
            popupopen: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
        focused = true;
        popup = true;
      },
      popupclose: function(e) {
        layer.setStyle({ weight: 0.5, fillOpacity: 0.4 });
        focused = false;
        popup = false;
      }
    });
};

  var toggleLayer = function() {
  var checked = $.one(".buttonRow input:checked").id;
  if (checked == "winDraw") {
    all = "winDraw";
  } else {
    all = "winScratch";
  }
  geojson.setStyle(style);
};


var getColor = function(d) {
    var value = d[all];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    // console.log(value)
    if (typeof value != "undefined") {
      // condition ? if-true : if-false;
     return value >= max * .7 ? '#7F180D' :
     		value >= max * .6 ? '#CA4317' :
     		value >= max * .5 ? '#D6793A' :
        value >= max * .4 ? '#FFB37B' :
        value >= 0 ? '#FDD1AC' :
             
             '#f1f2f2' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 1.5,
      opacity: .1,
      color: '#000',
      fillOpacity: 0.4
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

  var controls = document.querySelector(".buttonRow");

var onChange = function() {
  //find the radio button that's currently checked
  var value = document.querySelector(`input[name="layer-selection"]:checked`).id;
  all = value;
  max = Math.max.apply(null, data.features.map(f => f.properties[all]));
  
  var legend = document.querySelector(".legend");
  legend.innerHTML = `
    <li><span style="background: #7F180D" class="block"></span> ${(max * .7)+1 | 0}% or higher</li>
    <li><span style="background: #CA4317" class="block"></span> ${(max * .6)+1 | 0} - ${(max * .7) | 0}%</li>
    <li><span style="background: #D6793A" class="block"></span> ${(max * .5)+1 | 0} - ${(max * .6) | 0}%</li>
    <li><span style="background: #FFB37B" class="block"></span> ${(max * .4)+1 | 0} - ${(max * .5) | 0}%</li>
    <li><span style="background: #FDD1AC" class="block"></span> 0 - ${(max * .4) | 0}%</li>
  `;
  console.log(winScratch);
  geojson.setStyle(style);
};

controls.addEventListener("change", onChange);
onChange(); 

}

toggleLayer();
$.one(".buttonRow").addEventListener("change", toggleLayer);

 map.scrollWheelZoom.disable();
