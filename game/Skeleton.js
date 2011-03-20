

/**
 * Skeleton for body animation
 * @class Skeleton
 * @author Dimitri Larue
 * @constructor
 */

var Skeleton = pulse.extend(Tile,function(params){
	Tile.call(this,params);
	
    var defaults = {}; 
    params = jQuery.extend(defaults, params);

    
    this.bind(pulse.Animate.eventChange,this.updateAnchor);

});

Skeleton.prototype.components = null;

Skeleton.prototype.addComponent = function(compo,params){

	var defaults = {parent: 'main', aX: 0, aY: 0}; 
    params = jQuery.extend(defaults, params);
    if (!compo.name) throw 'Component must be named';
    if (!params.frameLabel) throw 'A frame label must be choosed';
    var id = this._getFrame(params.frameLabel);
	if (id === false) {
		throw 'Invalid frame label';
	}
    
    
    var x,y = x = 0;
    if(typeof this.frames[id].components[params.parent] != 'undefined'){
    	x = this.frames[id].components[params.parent].component.px;
    	y = this.frames[id].components[params.parent].component.py;
    }
    //console.log(x , y);
    compo.px = x + params.aX;
    compo.py = y + params.aY;
    this.frames[id].components[compo.name] = {parent: params.parent, aX : params.aX, aY: params.aY, component: compo, child:[]};
    if(params.parent !='main'){
    	this.frames[id].components[params.parent].child.push(compo.name);
    }
    this.addChild({child:compo, frameId: id});
};

Skeleton.prototype.getChildByZ = function() {
	
	var orderedElem = [];
	for(i in this.frames[this.currentFrame].components){
		orderedElem.push(this.frames[this.currentFrame].components[i].component);
	}
	orderedElem.sort(function(a,b){
		return b.zindex - a.zindex;
	});
	return orderedElem;
};

Skeleton.prototype.updateAnchor = function(event) {
	//console.log(event.source.property, event.source.object);
	if(!this.frames[this.currentFrame].components[event.source.object.name]) return
	var child=this.frames[this.currentFrame].components[event.source.object.name].child;
	for (i in event.source.property){
		if(i=='px' || i=='py'){
			//console.log(this.frames[this.currentFrame].components);
			for (j in child){
				//console.log(this.frames[this.currentFrame].components[child[j]]);
				var a = i;
				if(i == 'px'){
					a= 'aX';
				}
				else if (i == 'py'){
					a = 'aY';
				}
				this.frames[this.currentFrame].components[child[j]].component[i] = event.source.object[i] + this.frames[this.currentFrame].components[child[j]][a];
			}
		}
		else if (i == 'rotation'){
			for (j in child) {
				var item = this.frames[this.currentFrame].components[child[j]];
				var rot = event.source.object.rotation * Math.PI / 180;
				item.component.px = item.aX * Math.cos(rot) - item.aY * Math.sin(rot) + event.source.object.px;
				item.component.py = item.aX * Math.sin(rot) + item.aY * Math.cos(rot) + event.source.object.py;
			}
		}
	}
};

Skeleton.prototype._addFrame = function(params) {
	var id = Skeleton.prototype.super._addFrame.call(this,params);
	this.frames[id].components = {};
};