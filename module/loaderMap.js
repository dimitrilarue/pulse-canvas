function (pulse){
    pulse.loaderMap = function(data,draggable){
    	var map,
    		sprites = {},
    		tiles = [];
    	data.map['draggable'] = draggable;
    	map = new Grid(data.map);
    
    	for (var i in data.arena.sprites){
    		sprites[i] = new zac.Sprite(data.arena.sprites[i]);
    	}
    	var layers = data.arena.layers;
    	for (var name in layers){
    		var layer = layers[name];
    		for (var i in layer){
    			var elem = layer[i],
    			    tile = new Tile(elem.datas);
    			tiles.push(tile);
    			
    			for (var j in elem.sprites){
    				tile.addChild({child: sprites[elem.sprites[j]] });			
    			}
    			
    			map.addElement({layer:name,elem: tile});
    		}
    	}
    	return { map:map, tiles:tiles};
    }
}(pulse);
