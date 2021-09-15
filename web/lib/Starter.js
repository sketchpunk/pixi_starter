//import PIXI from './pixi.min.js';
import * as PIXI    from '/node_modules/pixi.js/dist/browser/pixi.mjs';
import Grid         from "./Grid.js";

// #region STARTUP
const mod_path = import.meta.url.substring( 0, import.meta.url.lastIndexOf("/") + 1 );
const css_path = mod_path + "Starter.css";

(function(){
    let link    = document.createElement( "link" );
    link.rel	= "stylesheet";
    link.type	= "text/css";
    link.media	= "all";
    link.href	= css_path;
    document.getElementsByTagName( "head" )[0].appendChild( link );
})();
// #endregion /////////////////////////////////////////////////////////////////////////


class Starter{
    //#region MAIN
    // { grid:false, resize:false, canvas:null }
    constructor( config={} ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Setup
        let opt = {
            width 			: window.innerWidth,
            height 			: window.innerHeight,
            resolution		: window.devicePixelRatio || 1,
            antialias       : true,
            backgroundAlpha : true,
            //backgroundColor : 0x505050,
        };

        if( config.canvas ) opt.value = config.canvas;

        this.app = new PIXI.Application( opt );
        document.body.appendChild( this.app.view );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Handle Configurations
        if( config.grid ) this.add( (this.grid = Grid()) );

        if( config.resize ) window.addEventListener( 'resize', ()=>{ 
            this.app.renderer.resize( window.innerWidth, window.innerHeight );
            if( this.grid ) this.grid.shader.uniforms.resolution = [ window.innerWidth, window.innerHeight ];
        });
    }
    //#endregion //////////////////////////////////////////////////////

    //#region METHODS
    render(){ this.app.render(); }

    add( o ){ this.app.stage.addChild( o ); return this; }

    remove( o ){ this.app.stage.removeChild( o ); return this; }

    colorSprite( color=0xff0000, w=20, h=20, pos=null ){
        const s = new PIXI.Sprite( PIXI.Texture.WHITE );
        s.tint      = color;        
        s.width     = w;
        s.height    = h;
        if( pos ) s.position.set( pos[0], pos[1] );

        this.add( s );
        return s;
    }
    //#endregion //////////////////////////////////////////////////////
}

export default Starter;
export { PIXI };