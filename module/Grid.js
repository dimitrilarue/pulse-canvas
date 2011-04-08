(function (pulse){
    var Grid = pulse.extend(pulse.Map,function(params){
    	pulse.Map.call(this,params);
    	
        var defaults = {
    		nbX: 20,
    	    nbY: 20,
    	    tileWidth: 80,
    	    tileHeight: 40
    	}; 
    	params = jQuery.extend(defaults, params);
    	
    	this.tileWidth = params.tileWidth;
    	this.tileHeight = params.tileHeight;
    	this.nbX = params.nbX;
    	this.nbY = params.nbY;
    	this.heightGridX = (this.nbX*this.tileHeight/2)-this.tileHeight/2;
    	this.widthGridX = (this.nbX*this.tileWidth/2)-this.tileWidth/2;
    	this.heightGridY = (this.nbY*this.tileHeight/2)-this.tileHeight/2;
    	this.widthGridY = (this.nbY*this.tileWidth/2)-this.tileWidth/2;
    	
    	this.dX = Math.round(this.canvas.width/2-(this.widthGridX+this.widthGridY)/2);
    	this.dY = Math.round(this.canvas.height/2-(this.heightGridX+this.heightGridY)/2);
    	this.displayAll();
    });
    
    Grid.prototype.tileHeight = null;
    Grid.prototype.tileWidth = null;
    Grid.prototype.nbX = null;
    Grid.prototype.nbY = null;
    Grid.prototype.heightGridX = null;
    Grid.prototype.widthGridX = null;
    Grid.prototype.heightGridY = null;
    Grid.prototype.widthGridY = null;
    
    Grid.prototype.setCanvasSize = function(){
    	this.canvas.width = jQuery(window).width()-this.offset;
        this.canvas.height = jQuery(window).height()-this.offset;
    };
    Grid.prototype.updateDimension = function(x,y){
    	this.nbX = x;
    	this.nbY = y;
    	this.heightGridX = (this.nbX*this.tileHeight/2)-this.tileHeight/2;
    	this.widthGridX = (this.nbX*this.tileWidth/2)-this.tileWidth/2;
    	this.heightGridY = (this.nbY*this.tileHeight/2)-this.tileHeight/2;
    	this.widthGridY = (this.nbY*this.tileWidth/2)-this.tileWidth/2;
    	
    	this.dX = Math.round(this.canvas.width/2-(this.widthGridX+this.widthGridY)/2);
    	this.dY = Math.round(this.canvas.height/2-(this.heightGridX+this.heightGridY)/2);
    	this.displayAll();
    };
    
    Grid.prototype._userEventsManager = function(){
    	Grid.prototype._super._userEventsManager.call(this);
    	
    	var canvas = jQuery(this.canvas), that = this;
    	jQuery(window).resize(function() {
    		that.setCanvasSize();
    		that.displayAll();
    	});	
    	canvas.mousemove(function(e){	
    		if(!that.drag){
    			var pos = pulse.Mouse.getPos();
    			that.mouseY = Math.round((pos.x-that.dX)/that.tileWidth-(pos.y-that.heightGridX-that.dY)/that.tileHeight);
    			that.mouseX = Math.round((pos.x-that.dX)/that.tileWidth+(pos.y-that.heightGridX-that.dY)/that.tileHeight-1);
    			//console.log(that.mouseX, that.mouseY);
    			that.userEvent(pos.x, pos.y,false);
    		}
    	});
    	canvas.click(function(e){	
    		var pos = pulse.Mouse.getPos();
    		that.userEvent(pos.x, pos.y,true);
    	});
    };
    
    
    
    Grid.prototype.displayGrid = function(){
    	this.context.save();
    	this.context.translate(this.dX,this.dY);
    	this.context.beginPath();
    	this.context.globalAlpha = 1;
    	if(this.nbX>=this.nbY){
    		var c=this.nbX;
    	}else{
    		var c=this.nbY;
    	}
    	for(var i=0;i<=c;i++){
    		if(i<=this.nbX){
    			//ligne en Y
    			this.context.moveTo(i*this.tileWidth/2,i*this.tileHeight/2+(this.heightGridX+this.tileHeight/2));
    			this.context.lineTo(i*this.tileWidth/2+this.widthGridY+this.tileWidth/2,(this.heightGridX-this.heightGridY)+i*this.tileHeight/2);
    		}	
    		if(i<=this.nbY){
    			//Ligne en X
    			this.context.moveTo(i*this.tileWidth/2,(this.heightGridX+this.tileHeight/2)-(i*this.tileHeight/2));
    			this.context.lineTo(i*this.tileWidth/2+this.nbX*this.tileWidth/2,this.heightGridX*2-i*this.tileHeight/2+this.tileHeight);
    		}	
    		
    	}
    	this.context.stroke();
    	this.context.restore();
    };
    
    pulse.Grid = Grid;
    
    
})(pulse);


