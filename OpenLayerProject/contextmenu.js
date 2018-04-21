var StandardContextItems = [
    {
        text: 'Center map here',
        classname: 'some-style-class', // add some CSS rules,
        callback: center
    },
    '-', // this is a separator,
    {
        text: 'Draw',
        classname: 'some-style-class', // you can add this icon with a CSS class
        // instead of `icon` property (see next line)
        items: [{
            text: 'Point',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)
            callback: function (obj, map) {
                addInteraction('Point');
            }
        }, {
            text: 'LineString',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                addInteraction('LineString');
            }
        }, {
            text: 'Polygon',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                addInteraction('Polygon');
            }
        }, {
            text: 'Circle',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                addInteraction('Circle');
            }
        }, {
            text: 'Square',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                addInteraction('Square');
            }
        }, {
            text: 'Box',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                addInteraction('Box');
            }
        }, {
            text: 'Clean',
            classname: 'some-style-class', // you can add this icon with a CSS class
            // instead of `icon` property (see next line)

            callback: function (obj, map) {
                clearDraw();
            }
        },
        ]
    },
];
var SelectorContextMenu = [{
    text: 'FeatureA',

    callback: function (obj, map) {
        var ID = feature.get('ID');
        var ModelName = feature.get('ModelName')
        handleFeatureContexMenuEvent('view', ID, ModelName);
    }
},
{
    text: 'FeatureB',

    callback: function (obj, map) {
        var ID = feature.get('ID');
        var ModelName = feature.get('ModelName')
        handleFeatureContexMenuEvent('view', ID, ModelName);
    }
},
{
    text: 'FeatureC',
    callback: function (obj, map) {
        var ID = feature.get('ID');
        var ModelName = feature.get('ModelName')
        handleFeatureContexMenuEvent('view', ID, ModelName);
    }
}];
function clearDraw() {
    map.removeInteraction(draw);
    if (source) {
        source.clear();
    }
}
function center(obj) {
    var pan = ol.animation.pan({
        duration: 1000,
        easing: elastic,
        source: view.getCenter()
    });
    console.log(view.getCenter());
    map.beforeRender(pan);
    view.setCenter(obj.coordinate);
}