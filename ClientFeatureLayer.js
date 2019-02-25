define(["dojo/_base/declare",
    "dojo/_base/lang",
    "esri/Graphic",
    "esri/layers/FeatureLayer",
     "esri/geometry/SpatialReference",
    "esri/layers/support/Field",
    "esri/layers/support/LabelClass"
], function (declare, lang,Graphic, FeatureLayer, SpatialReference, Field, LabelClass) {
    var _PraseFields= function (obj) {
        if (obj instanceof Array) {
            obj = obj.length > 0 ? obj[0] : undefined;
        }

        var fields = [];
        if (obj && obj.attributes) {
            for (var item in obj.attributes) {
                fields.push(new Field({
                    name: item,
                    alias: item,
                    type: this._filedsTypeof(obj.attributes[item])
                }));
            }
        }
        return fields;
    };
    var _filedsTypeof = function (obj) {
        var result = typeof (obj);

        if (result === "number") {
            result = (obj % 1 === 0) ? "integer" : "double"
        }
        else if (result === "boolean") {
            result = typeof ("string");
        }
        return result;
    };
    var ClientFeatureLayer = function (options) { 
        options = lang.mixin(options,{
            source: [],
            objectIdField: "oid",  
            outFields: ["*"],
            geometryType: "point",
            renderer:{
                type: "simple",  // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                    size: 30,
                    color: "red",
                    outline: {  // autocasts as new SimpleLineSymbol()
                        width: 0.5,
                        color: "white"
                    }
                }
            }
        });
        options.fields = _PraseFields(options.source)
        FeatureLayer.call(this, options);
    }
    ClientFeatureLayer.__accessorMetadata__ = Object.create(FeatureLayer.__accessorMetadata__);
    ClientFeatureLayer._meta = Object.create(FeatureLayer._meta);
    ClientFeatureLayer.prototype = Object.create(FeatureLayer.prototype);
    ClientFeatureLayer.prototype.constructor = ClientFeatureLayer;
    ClientFeatureLayer.prototype.add = function (graphics) {
        if (!(graphics instanceof Array)) {
            graphics = [graphics];
        };
        var that = this;
        var queryParams = this.createQuery();
        queryParams.where = queryParams.where + " AND 1=2";
        this.queryFeatures(queryParams).then(function () {
            that.applyEdits({
                addFeatures: graphics
            }).then(function (v) {
                console.log(v);
            })
        })
    }

    return ClientFeatureLayer;
})