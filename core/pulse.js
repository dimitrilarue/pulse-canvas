/**
 * Global that contains all class and method of the framework
 * @namespace pulse
 * @author Dimitri Larue
 */
var pulse = {};

/**
 * Count the length of a associative array
 * @final
 * @property size
 * @return Number
 */
pulse.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        ++size;
    }
    return size;
};

/**
 * If the debug mode is activated or not
 * @static
 * @property debug
 */
pulse.debug = false;

/**
 * If the debug mode is activated show log into the console
 * @final
 * @method log
 */
pulse.log = function(log) {
	if (pulse.debug){
		console.log(log);
	}
};

/**
 * extend the object
 * @final
 * @param {Object} parent the parent to extend
 * @param {function} child constructor of the new class
 * @method extend
 */
pulse.extend = function(parent,child){
	
		
	if (typeof parent != 'function')return;	
	
	function temp() {};
	temp.prototype = parent.prototype;
	child.prototype = new temp();
	
	child.prototype._super = parent.prototype;
	child.prototype.constructor = child;
		
	
	return child;
};

/**
 * return a uniq id
 * @final
 * @return Number
 * @method getUniqueId
 */
pulse.getUniqueId =(function(){
	var id=0;
	return function()		{
		if (arguments[0]==0) id=0;
		return ++id;
	};
}
)();


/**
 * Base object for the framework
 * @class Base
 * @namespace pulse
 * @author Dimitri Larue
 * @constructor
 */
pulse.Base = function(){
	this.setId();
};

/**
 * Id of the object instance
 * @default 0
 * @property id
 * @type Number
 */
pulse.Base.prototype.id = 0;

/**
 * Object parents in the canvas of this instance
 * @default null
 * @property parents
 * @type object
 */
pulse.Base.prototype.parents = null;

/**
 * Add object parent in the canvas
 * @method addParent
 */
pulse.Base.prototype.addParent = function(item){
	if(this.parents == null) {
		this.parents = {};
	}
	this.parents[item.id] = item;
};

/**
 * Set the id of the new instance
 * @method setId
 */
pulse.Base.prototype.setId = function(){
	this.id = pulse.getUniqueId();
};

/**
 * A mouse manager
 * @final
 * @type Object
 * @constructor
 */
pulse.Mouse = function(){
	
	/**
	 * mouse info on each move
	 * @private
	 * @property that
	 * @type Object
	 */
	var that = {};
	jQuery(document).mousemove(function(e) {
		that.oldX=that.pageX;
		that.oldY=that.pageY;
		that.pageX=e.pageX;
		that.pageY=e.pageY;
	});
	
	var obj = {};	
	/**
	 * Get the position of the mouse in document
	 * @method getPos
	 * @return Object
	 */
	obj.getPos = function(){
		return {x:that.pageX,y:that.pageY};
	};
	
	/**
	 * Get the position of the old mouse in document for the previous move
	 * @method getOldPos
	 * @return Object
	 */
	obj.getOldPos = function(){
		return {x:that.oldX,y:that.oldY};
	};
	
	/**
	 * Get the difference of the old and new position
	 * @method getDeriv
	 * @return Object
	 */
	obj.getDeriv = function(){
		return {x:that.pageX-that.oldX,y:that.pageY-that.oldY};
	};
	return obj;
}();