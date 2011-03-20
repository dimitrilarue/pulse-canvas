var Player = pulse.extend(Skeleton,function(params){
	Skeleton.call(this,params);
	
    var defaults = {}; 
    params = jQuery.extend(defaults, params);

    var torse = new pulse.Sprite({
    	src:'/images/joueur/male/lourd/PersoLourdMale.png',
    	width:53,
    	height:113,
    	name: 'tronc'
    });
    
    this.anchor = {x:-10,y:83};
    this.setFrame({frameId:0,label:'Diagonale_Bas_Droite'});
    this.addComponent(torse,{frameLabel:'Diagonale_Bas_Droite'});
    
});