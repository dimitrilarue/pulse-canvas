FILES = core/pulse.js\
		core/EventManager.js\
		core/Interval.js\
		core/loader.js\
		core/Sprite.js\
		core/Element.js\
		core/Map.js\
		module/Tile.js\
		module/Grid.js\
        
all : pulse

pulse : ${FILES}
	@@echo "Building" ${FILES} 
	@@cat ${FILES} > pulse.js
