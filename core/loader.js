(function (pulse){

    var images = {},
        loader = {};
    
    loader.addImage = function (src, onload) {
            
        if(typeof src !== "string") throw 'Source url of the image must be a string';
        if(images[src] instanceof HTMLImageElement === false) {
            images[src] = new Image();
            images[src].src = src;
        }
        if(typeof onload === 'function') images[src].onload = onload;
        return images[src];
        
    };
    
    loader.getImage = function (src) {
        if(images[src] instanceof HTMLImageElement) return images[src];
        return false;
    };
    
    
    pulse.loader = loader;
    
})(pulse);
