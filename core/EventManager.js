/**
 * @class Event
 * @author Dimitri Larue
 * @namespace pulse
 * @constructor
 */
pulse.Event = function (source,key){
	this.key = key;
	this.source = source;
};

pulse.Event.prototype = {
	/**
	 * key of event
	 * @property key
	 * @type String
	 * @default null
	 */
	key: '',
	
	/**
	 * Object source of the Event
	 * @property source
	 * @type Object
	 * @default null
	 */
	source: null,
	
	/**
	 * Object target of the Event
	 * @property target
	 * @type Object
	 * @default null
	 */
	target: null,
	
	/**
	 * Setter for target
	 * @method target
	 */
	setTarget: function(target){
		this.target = target;
	}
};


/**
 * Manager for event, can bind or trigger a event
 * @class EventManager
 * @author Dimitri Larue 
 * @namespace pulse
 * @constructor
 */
pulse.EventManager = pulse.extend(pulse.Base,function(){
	pulse.Base.call(this);
});

/**
 * Associative Array for bind events and function
 * @property events
 * @type Object
 */
pulse.EventManager.prototype.events = null;


/**
 * Bind a function to a Event key
 * @method bind
 */
pulse.EventManager.prototype.bind = function(key,func){
	if (this.events == null){
		this.events = new Object;
	}
	this.events[key]=func;	
};

/**
 * unbind a key event
 * @method unbind
 */
pulse.EventManager.prototype.unbind = function(key){
	delete(this.events[key]);	
};

/**
 * Fire a event and propagate a Event to parent object
 * @param {Event} Event to send
 * @method trigger 
 */
pulse.EventManager.prototype.trigger = function(event){
	if(!this._hasEvent(event)){
		this._propagateEvent(event);
	}
};

/**
 * Test the object has bind the param event, and set the target
 * @method _hasEvent
 * @private
 * @param {Event} 
 */
pulse.EventManager.prototype._hasEvent = function(event){
	
	if (this.events != null && typeof this.events[event.key] == 'function'){
		event.setTarget(this);
		this.events[event.key].apply(this, [event]);
		return true;
	}
	return false;
};

/**
 * Propagate the Event to parent object
 * @method _propagateEvent 
 * @param {Event}
 */
pulse.EventManager.prototype._propagateEvent = function(event){
	if (this.parents != null) {
		for(i in this.parents){
			this.parents[i].trigger(event);
		}
	}
	else {
		event = null;
	}
};