/**
 * For an easy display of graphic element on canvas
 * @class Sprite
 * @namespace pulse
 * @author Dimitri Larue
 * @constructor
 */
pulse.Sprite = pulse.extend(pulse.EventManager,function(params){
	pulse.EventManager.call(this);
	
	var defaults = {src: '', px: 0, py: 0, height: 0, width: 0, zindex: 0}; 
    params = jQuery.extend(defaults, params);
    

    this.height 	= params.height;
    this.width 		= params.width;
    this.addChild(params.src);
    
    this.px 		= params.px;
    this.py 		= params.py;
	this.zindex 	= params.zindex;
	this.name 		= params.name;
	this.anchor 	= {};
	this.anchor.x 	= 0;
	this.anchor.y 	= 0;
	this.effects 	= {};
	this.script 	= function(){};
    
    if(params.src != ''){
        this.image = pulse.loader.getImage(params.src);            
            
        if (this.image === false) {
            var that = this;
            this.image = pulse.loader.addImage(params.src,function(){that.trigger(new pulse.Event(that,'loaded')); });
        }
    }

	this.bind('loaded', this.display);
});

/**
 * Position x in pixel on convas relative to the parent object
 * @default 0
 * @property px
 * @type Number
 */
pulse.Sprite.prototype.name = null;

/**
 * Html image added to the sprite
 * @default null
 * @property image
 * @type HTMLImage
 */
pulse.Sprite.prototype.image = null;

/**
 * Position x in pixel on convas relative to the parent object
 * @default 0
 * @property px
 * @type Number
 */
pulse.Sprite.prototype.px = 0;

/**
 * Position y in pixel on convas relative to the parent object
 * @default 0
 * @property py
 * @type Number
 */
pulse.Sprite.prototype.py = 0;

/**
 * Transparency of the sprite
 * @default 1
 * @property alpha
 * @type Number
 */
pulse.Sprite.prototype.alpha = 1;

/**
 * Scale in X of the sprite
 * @default 1
 * @property scaleX
 * @type Number
 */
pulse.Sprite.prototype.scaleX = 1;

/**
 * Scale in Y of the sprite
 * @default 1
 * @property scaleY
 * @type Number
 */
pulse.Sprite.prototype.scaleY = 1;

/**
 * Rotation in radian of the sprite
 * @default 0
 * @property rotation
 * @type Number
 */
pulse.Sprite.prototype.rotation = 0;

/**
 * height of the sprite
 * @default 0
 * @property height
 * @type Number
 */
pulse.Sprite.prototype.height = 0;

/**
 * width of the sprite
 * @default 0
 * @property height
 * @type Number
 */
pulse.Sprite.prototype.width = 0;

/**
 * zindex of the sprite, determine the plan
 * @default 0
 * @property height
 * @type Number
 */
pulse.Sprite.prototype.zindex = 0;


/**
 * tmpBuffet for canvas when test mouseOver
 * @default null
 * @property canvasBuffer
 * @type Object
 */
pulse.Sprite.prototype.canvasBuffer = null;

/**
 * If mouse is currently in the area of sprite
 * @default false
 * @property mouseInZone
 * @type Boolean
 */
pulse.Sprite.prototype.mouseInZone = false;

/**
 * If mouse is currently over the sprite
 * @default false
 * @property mouseOver
 * @type Boolean
 */
pulse.Sprite.prototype.mouseOver = false;

/**
 * If the spire is currently displayed on canvas
 * @default false
 * @property displayed
 * @type Boolean
 */
pulse.Sprite.prototype.displayed = false;

/**
 * Pixel area of the sprite if displayed on canvas
 * @default null
 * @property Zone
 * @type Object
 */
pulse.Sprite.prototype.zone = null;

/**
 * Anchor point for displaying object
 * @default null
 * @property anchor
 * @type Object
 */
pulse.Sprite.prototype.anchor = null;
pulse.Sprite.prototype.effects = null;
pulse.Sprite.prototype.scripts = null;



pulse.Sprite.prototype.addEffect = function(key, effect, target) {

	if (typeof effect == 'function') {
		// pulse.log(typeof effect.active);
		this.effects[key] = effect;
		return true;
	}

	return false;
};
pulse.Sprite.prototype.hasEffect = function(key) {
	// pulse.log(this.effects[key]);
	if (typeof this.effects[key] == 'function')
		return true;
	return false;
};
pulse.Sprite.prototype.removeEffect = function(key) {
	if (this.hasEffect(key)) {
		delete (this.effects[key]);
	}
};

pulse.Sprite.prototype.getActiveEffects = function() {
	return this.effects;
};

/**
 * Test if the coordinate determine a transparent pixel
 * Send a mouseover event if coord is over the sprite
 * Send a mouseout event if coord is not over the sprite
 * Send a mouseenter event if coord enter on sprite
 * Send a mouseleave event if coord leave on sprite
 * @method isOver
 * @param px
 * @param py
 * @return boolean
 */
pulse.Sprite.prototype.isOver = function(px, py, click) {
    
	if(this.image instanceof HTMLImageElement === false) return false;
	
	/* If sprite not displayed */
	if (!this.displayed) {
		this.trigger(new pulse.Event(this, 'mouseout'));
		return false;
	}
	/* Start coord is on sprite */
	if ((px > this.zone.xStart)
	   && (px < this.zone.xEnd) 
	   && (py > this.zone.yStart)
	   && (py < this.zone.yEnd)
	) {

		if (!this.mouseInZone) {

			this.canvasBuffer = {};
			this.canvasBuffer.canvas =  document.createElement('canvas');
			this.canvasBuffer.canvas.width = this.width;
			this.canvasBuffer.canvas.height = this.height;
			this.canvasBuffer.context = this.canvasBuffer.canvas.getContext('2d');
			
		}
		this.canvasBuffer.context.clearRect(0,0,this.canvasBuffer.canvas.width,this.canvasBuffer.canvas.height);	
		
		if(this.scaleX !== 1 || this.scaleY !== 1) this.canvasBuffer.context.scale(this.scaleX,this.scaleY);
        if(this.rotation !== 0 || this.rotation !== 360)  this.canvasBuffer.context.rotate(this.rotation * Math.PI / 180);
        //console.log(-content.anchor.x, -content.anchor.y);
        //this.canvasBuffer.context.save();
        //this.canvasBuffer.context.translate(-content.anchor.x, -content.anchor.y);
        this.canvasBuffer.context.drawImage(this.image, this.px, this.py,  this.width, this.height);
        //this.canvasBuffer.context.restore();
		

		this.mouseInZone = true;
		if (this.canvasBuffer.context.getImageData(px - this.zone.xStart, py - this.zone.yStart, 1, 1).data[3] != 0) {
			if (!this.mouseOver) {
				this.trigger(new pulse.Event(this, 'mouseenter'));
				this.mouseOver = true;
			}
			this.trigger(new pulse.Event(this, 'mouseover'));
			if(click) this.trigger(new pulse.Event(this, 'click'));
			return true;
		} else {
			if (this.mouseOver) {
				this.trigger(new pulse.Event(this, 'mouseleave'));
				this.mouseOver = false;
			}
			this.trigger(new pulse.Event(this, 'mouseout'));
			return false;
		}
	}
	/* End coord is on sprite */
	else {
		this.mouseInZone = false;
		if (this.mouseOver) {
			this.mouseOver = false;
		}
		this.canvasBuffer = null;		
		return false;
	}
};

/**
 * Set State of the sprite
 * @method setState
 */
pulse.Sprite.prototype.setState = function(state) {
	switch (state) {
	case 'displayed':
		if (!this.displayed) {
			this.displayed = true;
		}
		break;
	case 'notdisplayed':
		if (this.displayed) {
			this.displayed = false;
		}
		break;

	}
};


pulse.prototype.setScript = function(fn) {
  if (typeof fn != "function") throw 'Param must be a function';
  this.script = fn;
};


/**
 * Send a event for display the Sprite
 * @method display
 */
pulse.Sprite.prototype.display = function() {
	this.trigger(new pulse.Event(this, 'display'));
};
pulse.Sprite.prototype.remove = function() {
	this.trigger(new pulse.Event(this, 'remove'));
};

