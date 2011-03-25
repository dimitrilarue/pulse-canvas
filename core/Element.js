/**
 * For an easy display of graphic element on canvas
 * @class Element
 * @namespace pulse
 * @author Dimitri Larue
 * @constructor
 */

pulse.Element = pulse.extend(pulse.Sprite, function(params) {
	pulse.Sprite.call(this);

	var defaults = {
		name : '',
		px : 0,
		py : 0,
		zindex : 0
	};
	params = jQuery.extend(defaults, params);


	this.frames = [];
	this.setFrame();

	this.interval = pulse.Interval.getInstance();
});

pulse.Element.prototype.frame = null;
pulse.Element.prototype.timeline = null;
pulse.Element.prototype.interval = null;
pulse.Element.prototype.played = false;
pulse.Element.prototype.currentFrame = 0;

pulse.Element.prototype.isOver = function(px, py, click) {
    pulse.Element._super.isOver(px, py, click);
    
    for (i in this.frames[this.currentFrame].content) {
        content = this.frames[this.currentFrame].content[i];
        if ((content instanceof pulse.Sprite)
           || (content instanceof pulse.Element)
        ) {
            content.isOver(px, py, click);
        }
    }
};


pulse.Element.prototype.setFrame = function() {
	var defaults = {
		frameId : null,
		label : null,
		duration : 0
	};
	params = jQuery.extend(defaults, params);

	// new frame
	if (params.frameId === null && params.label == null) {
		return this._addFrame(params);
	}
	// set a frame
	else if (params.frameId !== null) {
		if (typeof this.frames[params.frameId] == 'object') {
			if (params.label != null) {
				this.frames[params.frameId].label = params.label;
			}
			this.frames[params.frameId].duration = params.duration;
			return params.frameId;
		}
		throw 'Frame ' + params.frameId + ' is not defined';
	} else {
		var i = this._getFrameByLabel(params.label);
		if (i) {
			this.frames[i].duration = params.duration;
			return i;
		} else {
			// new frame
			return this._addFrame(params);
		}
	}
};

pulse.Element.prototype._getFrameByLabel = function(label) {

	for (var i in this.frames) {
		if (this.frames[i].label == label) {
			return i;
		}
	}
	return false;
};

pulse.Element.prototype._addFrame = function(params) {
	var id = this.frames.length;
	this.frames.push( {
		duration : params.duration,
		label : params.label,
		content : [],
		func: []
	});
	return id;
};

pulse.Element.prototype.addChild = function() {
    
    var id = 0,
        child  = arguments[0],
        frameTarget = arguments[1] || 0;
        //context = arguments[2],     
        //func = arguments[3];


	if ((child instanceof pulse.Sprite === false)	
	    && (child instanceof pulse.Element === false)
	) {
		throw 'Child must be a instance of pulse.Sprite or pulse.Element';
	}
	
	if (typeof frameTarget == "number") id = frameTarget;
	else if (typeof frameTarget == "string") {
		var frame = this._getFrameByLabel(frameTarget);
		if (frame !== false) id = frame;
	}
	
	this.frames[id].content.push(child);
	//this.frames[id].script.push({context:context,fn:func});
	child.addParent(this);
	
	/*
	var H = child.py + child.height;
	if (H > this.height) {
		this.height = H;
	}
	var W = child.px + child.width;
	if (W > this.width) {
		this.width = W;
	}
	*/

};

pulse.Element.prototype.getChildByZ = function() {
	if(layer == null) {
		layer = 'default';
	}
	var orderedElem = [];
	for(i in this.frames[this.currentFrame].content){
		orderedElem.push(this.frames[this.currentFrame].content[i]);
	}
	orderedElem.sort(function(a,b){
		return b.zindex - a.zindex;
	});
	return orderedElem;
};

pulse.Element.prototype.move = function(x, y) {
	this.px = x;
	this.py = y;
	this.display();
};

pulse.Element.prototype.go = function(frame) {
	if(typeof frame == 'number') {
		this.currentFrame = frame;		
	}
	else if (typeof frame == 'string'){
		var id = this._getFrameByLabel(frame);
		if(id === false) id = 0;
		this.currentFrame = id;
	}
};

pulse.Element.prototype.start = function() {

	//console.log(this.frames[this.currentFrame].duration);
	// pulse.log(this.frames[this.currentFrame].duration);
	if (this.frames[this.currentFrame].duration > 0) {
		this.timeline = this.interval.add(this,this._next,this.frames[this.currentFrame].duration);
		this.played = true;
		return true;
	}
	return false;
};

pulse.Element.prototype.stop = function() {
	this.interval.remove(this.timeline);
	this.played = false;
};

pulse.Element.prototype._next = function() {
	var next = this.currentFrame + 1;
	if (this.frames[next] == null) {
		next = 0;
	}
	this.currentFrame = next;
	this.interval.update(this.timeline,null,this.frames[next].duration);
	this.display();
};
