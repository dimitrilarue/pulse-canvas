(function (pulse){

	/**
	 * @class Map
	 */
	var Map = pulse.extend(pulse.EventManager,function(params){
	    pulse.EventManager.call(this);
	
	    params = params || {};
	    this.target = params.target || document.body;
	    this.height = params.height || 300;
	    this.width = params.width|| 300;
	    this.dX = params.dX || 0;
	    this.dY = params.dY || 0;
	    this.draggable = params.draggable || false;
	
	    this.layers = {};
	    this.drag = false;
	
	    this.canvas = document.createElement('canvas');
	    this.target.appendChild(this.canvas);
	    
	    this.setCanvasSize();
	    this.context = this.canvas.getContext('2d');
	
	    this.bind('display', this.onDisplayRequest);
	    this.bind('remove', this.onRemoveRequest);
	
	    this._userEventsManager();
	
	    var that = this;
	    interval.add(this, this.draw, 0);
	    
	    //Amazing way to render just when its needed
		//more info : http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		window.requestAnimFrame = (function(){
	      return  window.requestAnimationFrame       || 
	              window.webkitRequestAnimationFrame || 
	              window.mozRequestAnimationFrame    || 
	              window.oRequestAnimationFrame      || 
	              window.msRequestAnimationFrame     || 
	              function(/* function */ callback, /* DOMElement */ element){
	                window.setTimeout(callback, 1000 / 60);
	              };
	    })();
	    (function animloop(){
	      requestAnimFrame(animloop, that.draw);
	    })();
	    
	});
	
	Map.prototype.layers = null;
	Map.prototype.target = null;
	Map.prototype.height = null;
	Map.prototype.width = null;
	Map.prototype.className = null;
	Map.prototype.canvas = null;
	Map.prototype.draggable = null;
	Map.prototype.outCanvas = null;
	Map.prototype.outContext = null;
	Map.prototype.context = null;
	Map.prototype.dX = null;
	Map.prototype.dY = null;
	Map.prototype.toDraw = false;
	
	
	Map.prototype.setCanvasSize = function(width, heith){
		
		this.height = height || this.height;
		this.width = width || this.width
		
	    this.canvas.width = this.height;
	    this.canvas.height = this.width;
	};
	
	Map.prototype._userEventsManager = function(){
	    var canvas = jQuery(this.canvas),
	    that = this;
	
	    canvas.mousedown(function(e){
	        if (that.draggable) that.drag = true;
	    });
	    canvas.mouseup(function(e){
	        that.drag = false;
	        that.display();
	    });
	    canvas.mousemove(function(e){
	
	        if (that.drag){
	            var deriv = pulse.Mouse.getDeriv();
	            that.dX += deriv.x;
	            that.dY += deriv.y;
	            that.display();
	        }
	    });
	
	};
	
	Map.prototype.setOptionLayer = function(params){
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
	
	Map.prototype.addElement = function(elem,layer){
	    //pulse.log('addElem');
	   layer = layer || 'default';
	   
	    if (elem instanceof pulse.Sprite){
	        
	        this.layers[layer].elements[elem.id] = elem;
	        params.elem.addParent(this);
	
	    }
	};
	
	Map.prototype.addLayer = function(layer, options){
	    if (typeof this.layers[layer] === 'object') return;
	    
	    this.layers[layer] = {
	        options: options,
	        elements: {}
	    };
	};
	
	Map.prototype.getElementByZ = function(layer){
	    
	    layer = layer || "default";
	    
	    var orderedElem = [],
	        elements = this.layers[layer].elements,
	        i;
	        
	    for (i in elements){
	        orderedElem.push(elements[i]);
	    }
	    orderedElem.sort(function(a, b){
	        return b.zindex - a.zindex;
	    });
	    return orderedElem;
	};
	
	Map.prototype.draw = function(){
	    if (this.toDraw){
	        this.toDraw = false;
	        this.displayAll();
	    }
	
	};
	
	Map.prototype.display = function(){
	    this.toDraw = true;
	};
	
	Map.prototype.displayAll = function(){
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
	
	Map.prototype.displayGrid = function(){};
	
	Map.prototype.displayElement = function(elem){
	
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
	
	Map.prototype.isOnCanvas = function(elem){
	    if ((elem.px + this.dX + elem.width >= 0)
	       && (elem.px + this.dX - elem.width < this.canvas.width)
	       && (elem.py + this.dY + elem.width >= 0)
	       && (elem.py + this.dY - elem.width < this.canvas.height)
	    ){
	        return true;
	    }
	    return false;
	};
	
	
	
	Map.prototype.onDisplayRequest = function(){
	    this.display();
	    //	this.context.save();
	    //	this.context.translate(this.dX,this.dY);
	    //	this.displayElement(e.source);
	    //	this.context.restore();
	};
	Map.prototype.onRemoveRequest = function(e){
	    for (i in this.layers){
	        delete(this.layers[i].elements[e.source.id]);
	    }
	    this.display();
	};
	Map.prototype.userEvent = function(px, py, click){
	    for (layer in this.layers){
	        if (this.layers[layer].options.mouse === false) continue;
	
	        for (elem in this.layers[layer].elements){
	            this.layers[layer].elements[elem].isOver(px, py, click);
	        }
	
	    }
	};

	pulse.Map = Map;

})(pulse);
