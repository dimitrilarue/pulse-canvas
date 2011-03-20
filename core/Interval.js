/**
 * Singleton : Interval Manager for concentrate all interval in one for the framework
 * @class Interval
 * @author Dimitri Larue 
 * @namespace pulse
 * @constructor
 */
pulse.Interval = function() {
	if ( pulse.Interval.caller != pulse.Interval.getInstance ) {  
		throw new Error("This object cannot be instanciated");  
	}  
	
	this.intervals = {};
	this.start();
	this.timer = Date.now();
	this.count = 0;
};

/**
 * Static var for the instance of singleton
 * @default null
 * @property instance
 * @type Object
 * @static
 */
pulse.Interval.instance = null;  

/**
 * Return a instance singleton
 * @method getInstance
 * @return Interval
 * @static
 */
pulse.Interval.getInstance = function() {  
  if (this.instance == null) {  
      this.instance = new pulse.Interval();  
  }  
  return this.instance;  
};

/**
 * Associative Array for all intervals
 * @default null
 * @property intervals
 * @type Object
 */
pulse.Interval.prototype.intervals = null;

/**
 * Id of the setInterval
 * @default null
 * @property id
 * @type Number
 */
pulse.Interval.prototype.id = null;

/**
 * Frame per second for the canvas
 * @default 24
 * @property fps
 * @type Number
 */
pulse.Interval.prototype.fps = 24;

/**
 * Add a interval 
 * @param {Object} scope context on apply function
 * @param {Function} fn function to apply for each iteration
 * @param {Number} duration Time between iteration in milisecond
 * @method add
 * @return Number id of interval
 */
pulse.Interval.prototype.add = function(scope,fn,duration){
	id = pulse.getUniqueId();
	this.intervals[id] = {f:fn,d:duration,s:scope,t:Date.now()};
	return id;
};

/**
 * Update duration or function for an interval
 * @param {Number} index of the target interval
 * @param {Function} fn function to apply for each iteration
 * @param {Number} duration Time between iteration in milisecond
 * @method update
 */
pulse.Interval.prototype.update = function(index,fn,duration){
	if(fn != null) 	this.intervals[index].f = fn;
	if(duration != null) this.intervals[index].d = duration;
};

/**
 * Update duration or function for an interval
 * @param {Number} index of the target interval
 * @method remove
 */
pulse.Interval.prototype.remove = function(index){
	delete(this.intervals[index]);
};

/**
 * Start the interval instance with setInterval based on fps of the instance or a param, 
 * and set new fps if param
 * @param {Number} fps
 * @method remove
 */
pulse.Interval.prototype.start = function(fps){
	
	this.stop();
	
	if(fps == null){
		fps = this.fps;
	}
	else {
		this.fps = fps;
	}

	var that = this;
	var fn = function() {
		pulse.Interval.prototype._next.call(that);
	};
	this.id = setInterval(fn,Math.floor(1000 / fps)); //Math.floor(1000 / fps)
};

/**
 * Stop interval instance with clearInterval
 * @method stop
 */
pulse.Interval.prototype.stop = function(){
	clearInterval(this.id);
};

/**
 * Call for each interval, and check if a function need to be call
 * @method _next
 * @private
 */
pulse.Interval.prototype._next = function(){
	var currentTime = Date.now();
	for(var i in this.intervals){

		if(currentTime < this.intervals[i].t + this.intervals[i].d) continue;
		this.intervals[i].t = currentTime;
		this.intervals[i].f.call(this.intervals[i].s);
	}
	if(currentTime - this.timer > 1000){
		//console.log(this.count);
		this.count = 0;
		this.timer = Date.now();
	}
	this.count++;
	
};

/**
 * Return the current fps
 * @method getFps
 * @return Number
 */
pulse.Interval.prototype.getFps = function(){
	return this.fps;
};