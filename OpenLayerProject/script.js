var map;
var contextmenu;
var source = new ol.source.Vector({ wrapX: false });
var view = new ol.View({
    center: [11560106.846765194, 148975.76812780878],
    zoom: 14
});

window.addEventListener('load', function () {
    map = initMap();
});


function initMap() {

    var attribution = new ol.control.Attribution({
        collapsible: false
    });
    // create a vector layer used for editing
    var stroke = new ol.style.Stroke({
        color: 'red'
    });
    var textStroke = new ol.style.Stroke({
        color: '#fff',
        width: 3
    });
    var textFill = new ol.style.Fill({
        color: '#000'
    });
    var vector = new ol.layer.Vector({
        name: 'my_vectorlayer',
        source: source,
        style: (function () {
            var textStroke = new ol.style.Stroke({
                color: '#fff',
                width: 3
            });
            var textFill = new ol.style.Fill({
                color: '#000'
            });
            return function (feature, resolution) {
                return [new ol.style.Style({
                    cursor: 'pointer',
                    text: new ol.style.Text({
                        font: '34px Calibri,sans-serif',
                        text: getAreaLabel(feature),
                        fill: textFill,
                        stroke: textStroke
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ff7733'
                        })
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    })
                })];
            };
        })()
    });

    // Create a map
    map = new ol.Map({
        layers: [
            new ol.layer.Group({
                'title': 'Base map',
                layers: [
                    new ol.layer.Tile({
                        title: 'Base',
                        source: new ol.source.OSM(),
                    }),
                    vector
                ],
            })
        ],
        controls: ol.control.defaults({ attribution: false }).extend([attribution]),
        target: 'map',
        view: view
    });


    //create contextmenu
    contextmenu = new ContextMenu({
        width: 170,
        default_items: true, //default_items are (for now) Zoom In/Zoom Out
        items: StandardContextItems
    });

    map.addControl(contextmenu);

    map.getViewport().addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var offset = $(this).offset();
        var mapX = e.x - offset.left;
        var mapY = e.y - offset.top;
        var clkfeatures = [];
        map.forEachFeatureAtPixel([mapX, mapY], function (ft, layer) {
            if (typeof ft.get('ModelName') !== 'undefined') {
                if (!contains.call(clkfeatures, ft)) {
                    clkfeatures.push(ft);
                }
            }
        });
        console.log('length : ' + clkfeatures.length);
        if (clkfeatures.length > 1) {
            contextmenu.clear();
            contextmenu.extend(SelectorContextMenu);

        } else if (clkfeatures.length == 1) {
            contextmenu.clear();
            var ID = clkfeatures[0].get('ID');
            var ModelName = clkfeatures[0].get('OpenlayersMapType')
            var FeatureContextMenu = [{
                text: 'View',
                callback: function (obj, map) {

                    handleFeatureContexMenuEvent2('view', ID, ModelName);
                }
            },
            {
                text: 'Edit',
                callback: function (obj, map) {
                    handleFeatureContexMenuEvent2('edit', ID, ModelName);
                }
            },
            {
                text: 'EditArea',
                callback: function (obj, map) {
                    handleFeatureContexMenuEvent2('editarea', ID, ModelName, mapX, mapY);
                }
            }];
            contextmenu.extend(FeatureContextMenu);
        }
        else {
            contextmenu.clear();
            contextmenu.extend(StandardContextItems);
        }
    });
    return map;
}

var draw; // global so we can remove it later
function addInteraction(value) {
    if (value)
        map.removeInteraction(draw);
    if (value !== 'None') {
        var geometryFunction, maxPoints;
        if (value === 'Square') {
            value = 'Circle';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
        } else if (value === 'Box') {
            value = 'LineString';
            maxPoints = 2;
            geometryFunction = function (coordinates, geometry) {
                if (!geometry) {
                    geometry = new ol.geom.Polygon(null);
                }
                var start = coordinates[0];
                var end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);
                return geometry;
            };
        }
        draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ (value),
            geometryFunction: geometryFunction,
            maxPoints: maxPoints
        });
        map.addInteraction(draw);

        draw.on('drawend', function (event) {
            map.removeInteraction(draw);

            var title = prompt("Please provide the Area Title:", "untitled");

            event.feature.setProperties({
                'id': title + GetID(),
                'name': title,
                'MapMarkerTitle': title,
                'Display': title,
                'ModelName': title,
                'MapAreaLabelText': title
            });
        });
    }
}

function getLongLatFromPoint(loc) {
    return ol.proj.transform(loc, 'EPSG:3857', 'EPSG:4326')
}

function getAreaLabel(feature) {
    if (typeof feature.get('ModelName') !== 'undefined') {
        var title = feature.get('Display');
        return title;
    }
}


function handleFeatureContexMenuEvent2(option, ID, ModelName, x, y) {
    contextmenu.clear();
    if (option == 'edit') {
        console.log('edit');
    } else if (option == 'view') {
        console.log('view');
    } else if (option == 'editarea') {
        console.log('editarea');
        var AreaEditMenu = [
            {
                text: 'Save',
            },
            {
                text: 'Cancel',
            }
        ];
        contextmenu.extend(AreaEditMenu);
    }
}