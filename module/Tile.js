(function (pulse){
    Tile = pulse.extend(pulse.Element,function(params){
    	pulse.Element.call(this,params);
    	
        var defaults = {cx: 0, cy: 0, baseX: 1, baseY: 1, anchor: {x:0, y:0}, briqueLevel:0}; 
        params = jQuery.extend(defaults, params);
    
        this.cx = params.cx;
        this.cy = params.cy;    
        this.zindex = this.cy - this.cx;   
        this.baseX = params.baseX;
        this.baseY = params.baseY;
    	this.anchor = params.anchor;
    	this.briqueLevel = params.briqueLevel;
    });
    
    
    Tile.prototype.cx = 0;
    Tile.prototype.cy = 0;
    Tile.prototype.baseX = 0;
    Tile.prototype.baseY = 0;
    Tile.prototype.decalY = 0;
    Tile.prototype.displayParent = null;
    Tile.prototype.mouvement = null;
    Tile.prototype.briqueLevel = null;
    
    Tile.prototype.move = function(x,y){
    	this.cx = x;
    	this.cy = y;
        this.zindex = this.cy - this.cx;
        
        var cTo = this.calculCoord();
        if(this.mouvement instanceof pulse.Animate){
        	this.mouvement.stop();
        }
        this.mouvement = new pulse.Animate(this,0.5,{px:cTo.px,py:cTo.py});
        
    };
    
    Tile.prototype.jump = function(x,y){
    
    
    	var cTo = this.calculCoord(x,y);
    	
    	var fall = function(){
    		this.unbind(pulse.Animate.eventComplete);
    		this.mouvement = new pulse.Animate(this,0.5,{px:cTo.px,py:cTo.py,ease:'easeInCirc'});	
    		this.cx = x;
    		this.cy = y;
    	    this.zindex = this.cy - this.cx;
    	};
    	
        if(this.mouvement instanceof pulse.Animate){
        	this.mouvement.stop();
        }
        this.mouvement = new pulse.Animate(this,0.5,{px:(this.px+cTo.px)/2,py:this.py-200,ease:'easeOutCirc'});
        this.bind(pulse.Animate.eventComplete, fall);
    };
    
    Tile.prototype.addParent = function(parent){
    	Tile.prototype._super.addParent.call(this,parent);
    	//this.anchor 	= {x:-(this.width/2), y:-(this.height/2)};
    	if (parent instanceof Grid){
    		this.displayParent = parent;
    		
    
    //		var heightX=this.baseX*this.displayParent.tileHeight/2;
    //		var heightY=this.baseY*this.displayParent.tileHeight/2;
    //		var heightBase = heightX + heightY;
    //		if(heightBase == this.height){
    //			if(heightX>heightY){
    //				this.decalY=0;				
    //			}
    //			else {
    //				this.decalY=heightY-heightX;	
    //			}
    //		}
    	    var c = this.calculCoord();
    	    this.px = c.px;
    	    this.py = c.py;
    	}
    
    	
    	
    };
    
    Tile.prototype.calculCoord = function(x,y){
    		
    	if (x === undefined || y === undefined){
    		x = this.cx;
    		y = this.cy;
    	}
    	
    	var c = {};
    	c.px = (x+y)*this.displayParent.tileWidth/2;
    	c.py = this.displayParent.heightGridX + (x-y)*this.displayParent.tileHeight/2 ;
    	return c;
    };

})(pulse);
