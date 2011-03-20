window.editor = {};
window.editor.select = null;
window.editor.selected = null;
window.editor.sprite = [];

$(function() {
    
	$("#loadimg").click(loadImg);
	$("#delete").click(deleteTile);
	$("#export").click(exportMap);
	$("#import").click(importMap);
	$("#property").hide();
	$("#property").children('#briquelevel').change(changeBrique);
	$(document).keydown(moveSelected);
	$("input[name='map']").change(loadMap);
	//loadMap();
});

function importMap() {
	$.ajax({
		url: 'map.json',
		dataType: 'json',
		success: function(data){
			var loader = loaderMap(data,true);
			 editor.map = loader.map;
			 for (i in loader.tiles) {
			     loader.tiles[i].bind('click',spriteSelection);
			 }
             $("input[name='layer']").change(activelayer);
			 activelayer();
		}
	});
}

function loadMap(){
	if(!editor.map) editor.map = new Grid({nbX:$("#mapX").val(),nbY:$("#mapY").val(),draggable:1});
	else {
		console.log($("#mapX").val());
		editor.map.updateDimension($("#mapX").val(),$("#mapY").val());
		
	}
	$(editor.map.canvas).mousemove(move);
	$(editor.map.canvas).click(addSprite);
	$("input[name='layer']").change(activelayer);
	activelayer();
}
var loadImg = function(){
	var id = 1;
	return function(){
		if(!editor.ressources) editor.ressources = {};
		var image      	= new Image();
	    image.src  	= $("#loaderimg").val();
	    image.onload 	= function(){
	    	editor.ressources[id] = {};
	    	editor.ressources[id].sprite = new zac.Sprite({src:image.src, height: image.height, width: image.width});
	    	editor.ressources[id].image = image;
	    	displayRessource();
		    id++;
	    };
	};
	
    
}();

function displayRessource(){
	$('#ressources').empty();
	for (i in editor.ressources) {
		var node = $('<div>').append(editor.ressources[i].image).attr('id',i);
		//node.append('<br /><label>Level Brique :</label><input type="input" class="level" value="0" />');
		node.click(selectRessource);		
		$('#ressources').append(node);
	}
};

function selectRessource(){
	//if(editor.mouseSelect && editor.mouseSelect.remove)editor.mouseSelect.remove();
	$('#ressources').children().removeClass('select');
	var id = $(this).attr('id');
	if( editor.select == id ) editor.select = null;
	else {
		resetAlpha();
		editor.select = id;
		$(this).addClass('select');
	}
	console.log(editor.select);
	//console.log(editor.mouseSelect);
};

function move(e){
	if(editor.map) {
		$('#position').text('X : ' + editor.map.mouseX + ' | Y : ' +  editor.map.mouseY);
	}
};

function activelayer(){
	var active = false;
	if($("#decor").is(":checked")) active=true;
	editor.map.setOptionLayer({layer:'decor',option:'mouse',value:active});
	editor.map.setOptionLayer({layer:'zactive',option:'mouse',value:!active});
}

function addSprite(){
	if(editor.map && editor.select) {
		var tile = new Tile({cx:editor.map.mouseX,cy:editor.map.mouseY,baseX:1,baseY:1});
		tile.sprite=editor.select;
		tile.bind('click',spriteSelection);
		tile.addChild({child: editor.ressources[editor.select].sprite});
		editor.sprite.push(tile);
		var layer = $("input[name='layer']:checked").val();
		console.log(layer);
		editor.map.addElement({layer: layer, elem: tile});
		$('#ressources').children().removeClass('select');
		editor.select = null;

	}
}

function spriteSelection(){

    console.log(this);
    resetAlpha();
    if (editor.selected == this) {
        editor.selected = null;
        this.display();
        $("#property").hide();
        return;
    }
    $("#property").show();
    $("#property").children('#briquelevel').val(this.briqueLevel);
        this.alpha=0.5;
        editor.selected = this;
        this.display();
    }

function resetAlpha() {
	for(layer in editor.map.layers){
    	console.log('layer :',layer);
    	var elems = editor.map.getElementByZ(layer);
    	console.log(elems);
    	for(elem in elems){
    		elems[elem].alpha=1;
    	}
    }
}

function moveSelected(e){
	if(!editor.selected) return;
	var keyCode = e.keyCode || e.which, arrow = {left: 37, up: 38, right: 39, down: 40 };
	
	switch (keyCode) {
		case arrow.left:
			editor.selected.anchor.x+=1;
			editor.selected.display();
		break;
		case arrow.up:
			editor.selected.anchor.y+=1;
			editor.selected.display();
		break;
		case arrow.right:
			editor.selected.anchor.x-=1;
			editor.selected.display();
		break;
		case arrow.down:
			editor.selected.anchor.y-=1;
			editor.selected.display();
		break;
	}
		
}

function changeBrique(){
	if(!editor.selected) return;
	editor.selected.briqueLevel = $(this).val();
};
function deleteTile(){
	if(!editor.selected) return;
	editor.selected.remove();
};

function exportMap(){
	var grid = {};
	grid.map = {
			tileWidth:editor.map.tileWidth,
			tileHeight:editor.map.tileHeight,
			nbX:editor.map.nbX,
			nbY:editor.map.nbY
		};
	grid.arena = {};
	grid.arena.sprites = {};
	grid.arena.layers = {};
	for (i in editor.ressources) {
		grid.arena.sprites[i] = {src:editor.ressources[i].image.src, height:editor.ressources[i].image.height, width:editor.ressources[i].image.width};
	}
	for(layer in editor.map.layers){
    	var elems = editor.map.getElementByZ(layer);
		grid.arena.layers[layer] = [];
    	for(elem in elems){
    		var tile = {
    				cx:elems[elem].cx,
    				cy:elems[elem].cy,
    		    	baseX:elems[elem].baseX,
    		    	baseY:elems[elem].baseY,
    		    	briqueLevel:elems[elem].briqueLevel,
    		    	anchor:	elems[elem].anchor
    		};
    		grid.arena.layers[layer].push({sprites:[elems[elem].sprite],datas:tile});
    	}
    }
	var exporter = window.open();
	exporter.document.write($.JSON.encode(grid));
}