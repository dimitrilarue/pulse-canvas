/**
 * @class Map
 */
pulse.Map = pulse.extend(pulse.EventManager,function(params){

    pulse.EventManager.call(this);

    var defaults = {
        offset: 0,
        target: document.body,
        height: 300,
        width: 300,
        nbX: 20,
        nbY: 20,
        dX: 0,
        dY: 0,
        tileWidth: 20,
        tileHeight: 10
    };
    params = jQuery.extend(defaults, params);

    this.offset = -params.offset;
    this.target = params.target;
    this.height = params.height;
    this.width = params.width;
    this.dX = params.dX;
    this.dY = params.dY;
    this.className = params.className;
    this.drag = false;

    this.draggable = params.draggable;

    this.layers = {};

    this.canvas = document.createElement('canvas');
    this.target.appendChild(this.canvas);
    
    this.setCanvasSize();
    this.context = this.canvas.getContext('2d');

    this.bind('display', this.onDisplayRequest);
    this.bind('remove', this.onRemoveRequest);

    this._userEventsManager();

    var interval = pulse.Interval.getInstance();
    interval.add(this, this.draw, 0);
});

pulse.Map.prototype.layers = null;
pulse.Map.prototype.offset = null;
pulse.Map.prototype.target = null;
pulse.Map.prototype.height = null;
pulse.Map.prototype.width = null;
pulse.Map.prototype.className = null;
pulse.Map.prototype.canvas = null;
pulse.Map.prototype.draggable = null;
pulse.Map.prototype.outCanvas = null;
pulse.Map.prototype.outContext = null;
pulse.Map.prototype.context = null;
pulse.Map.prototype.dX = null;
pulse.Map.prototype.dY = null;
pulse.Map.prototype.toDraw = false;


pulse.Map.prototype.setCanvasSize = function(){
    this.canvas.width = this.height;
    this.canvas.height = this.width;
};

pulse.Map.prototype._userEventsManager = function(){
    var canvas = jQuery(this.canvas),
    that = this;

    canvas.mousedown(function(e){
        if (that.draggable) that.drag = true;
    });
    canvas.mouseup(function(e){
        that.drag = false;
        that.display();
        //canvas.offset({top :that.offset/2,left :that.offset/2});
    });
    canvas.mousemove(function(e){

        if (that.drag){
            //var offset = canvas.offset();
            var deriv = pulse.Mouse.getDeriv();
            that.dX += deriv.x;
            that.dY += deriv.y;
            that.display();
            //canvas.offset({left:offset.left+deriv.x,top:offset.top+deriv.y});
        }
    });

};

pulse.Map.prototype.setOptionLayer = function(params){
    var defaults = {
        layer: 'default',
        option: null,
        value: false
    };
    params = jQuery.extend(defaults, params);

    if (params.option != null){
        if (!this.layers[params.layer]) return;
        this.layers[params.layer].options[params.option] = params.value;
    }
};

pulse.Map.prototype.addElement = function(params){
    //pulse.log('addElem');
    var defaults = {
        layer: 'default',
        elem: null
    };
    params = jQuery.extend(defaults, params);
    if (params.elem instanceof pulse.Sprite){
        if (this.layers[params.layer] == null) this.layers[params.layer] = {
            options: {
                order: length
            },
            elements: {}
        };
        this.layers[params.layer].elements[params.elem.id] = params.elem;
        params.elem.addParent(this);

    }
};

pulse.Map.prototype.getElementByZ = function(layer){
    
    layer = layer || "default";
    
    var orderedElem = [];
    for (i in this.layers[layer].elements){
        orderedElem.push(this.layers[layer].elements[i]);
    }
    orderedElem.sort(function(a, b){
        return b.zindex - a.zindex;
    });
    return orderedElem;
};

pulse.Map.prototype.draw = function(){
    if (this.toDraw){
        this.toDraw = false;
        this.displayAll();
    }

};

pulse.Map.prototype.display = function(){
    this.toDraw = true;
};

pulse.Map.prototype.displayAll = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //	this.context.save();
    //    this.context.fillStyle = 'rgba(75, 75, 75, .5)';
    //    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //    this.context.restore();
    this.displayGrid();
    this.context.save();
    this.context.translate(this.dX, this.dY);
    for (layer in this.layers){
        var elems = this.getElementByZ(layer);
        //pulse.log(elems);
        for (elem in elems){
            if (this.isOnCanvas(elems[elem])){
                this.displayElement(elems[elem]);
                elems[elem].setState('displayed');
            }
            else{
                elems[elem].setState('notdisplayed');
            }
        }
    }
    this.context.restore();
    //pulse.log(diffTime + 'ms');
    //pulse.log(1000/diffTime + 'fps');
};

pulse.Map.prototype.displayGrid = function(){};

pulse.Map.prototype.displayElement = function(elem){

    this.context.save();
    this.context.translate(elem.px, elem.py);

    var effect = elem.getActiveEffects();
    
    for (i in effect){
        effect[i].apply(elem, [this.context]);
    }
    
    if (elem.alpha != 1) this.context.globalAlpha = elem.alpha;
    if (elem.scaleX != 1 || elem.scaleY != 1) this.context.scale(elem.scaleX, elem.scaleY);    
    if (elem.rotation != 0 || elem.rotation != 360) this.context.rotate(elem.rotation * Math.PI / 180);
    
    this.context.save();
    this.context.translate( - elem.anchor.x, - elem.anchor.y);

    if (elem.image instanceof HTMLImageElement){
        this.context.drawImage(elem.image, 0, 0);
    }
    else if (elem instanceof pulse.Element){
        for (i in elem.getChildByZ()){
            var content = elem.frames[elem.currentFrame].content[i];
            if (content instanceof pulse.Sprite){
                this.displayElement(content);
            }
        }
    }
    elem.script();
    
    this.context.restore();
    this.context.restore();
    var pxReal = elem.px + this.dX - elem.anchor.x;
    var pyReal = elem.py + this.dY - elem.anchor.y;
    elem.zone = {
        xStart: pxReal,
        xEnd: pxReal + elem.width * elem.scaleX,
        yStart: pyReal,
        yEnd: pyReal + elem.height * elem.scaleY
    };


};

pulse.Map.prototype.isOnCanvas = function(elem){
    if ((elem.px + this.dX + elem.width >= 0)
       && (elem.px + this.dX - elem.width < this.canvas.width)
       && (elem.py + this.dY + elem.width >= 0)
       && (elem.py + this.dY - elem.width < this.canvas.height)
    ){
        return true;
    }
    return false;
};



pulse.Map.prototype.onDisplayRequest = function(){
    this.display();
    //	this.context.save();
    //	this.context.translate(this.dX,this.dY);
    //	this.displayElement(e.source);
    //	this.context.restore();
};
pulse.Map.prototype.onRemoveRequest = function(e){
    console.log(e.source);
    for (i in this.layers){
        delete(this.layers[i].elements[e.source.id]);
    }
    this.display();
};
pulse.Map.prototype.userEvent = function(px, py, click){
    for (layer in this.layers){
        if (this.layers[layer].options.mouse === false) continue;

        for (elem in this.layers[layer].elements){
            this.layers[layer].elements[elem].isOver(px, py, click);
        }

    }
};

