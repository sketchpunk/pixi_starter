import PIXI from './pixi.min.js';

function Grid( w=window.innerWidth, h=window.innerHeight, minGrid=10, maxGrid=50 ){
    // Create a ScreenSpace Quad
    const geo   = new PIXI.Geometry();
    geo.addAttribute( 'aVertexPosition', [ -1,1, -1,-1, 1,-1, 1,-1, 1,1, -1,1 ] );

    // Shader and Mesh
    const sh    = PIXI.Shader.from( VERT_SRC, FRAG_SRC, { resolution:[ w, h ], maxGridSize:maxGrid, minGridSize:minGrid } );
    const mesh  = new PIXI.Mesh( geo, sh );

    return mesh;
}

//#region GLSL
const VERT_SRC = `#version 300 es

precision mediump float;
in vec2 aVertexPosition;

//uniform mat3 translationMatrix;
//uniform mat3 projectionMatrix;

void main() {
    //gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    gl_Position = vec4( aVertexPosition, 0.0, 1.0 );
}`;

const FRAG_SRC = `#version 300 es
precision mediump float;

out     vec4    out_color;
uniform vec2    resolution; // TODO Should be a UBO
uniform float   minGridSize;
uniform float   maxGridSize;

////////////////////////////////////////////////////////////////////////

// Thick lines 
float grid( vec2 fragCoord, float space, float gridWidth ){
    vec2 p    = fragCoord - 0.5;
    vec2 size = vec2( gridWidth - 0.5 );
    
    vec2 a1 = mod( p - size, space );
    vec2 a2 = mod( p + size, space );
    vec2 a  = a2 - a1;
       
    float g = min( a.x, a.y );
    return clamp( g, 0.0, 1.0 );
}

// RGB to Vec3
vec3 rgb( int c ){
    return vec3(
        float( ( c >> 16 ) & 0xff ) * 0.00392156863,
        float( ( c >> 8 ) & 0xff )  * 0.00392156863,
        float( c & 0xff )           * 0.00392156863
    );
}

////////////////////////////////////////////////////////////////////////

void main(){
    vec2  fragCoord = vec2( gl_FragCoord.x, resolution.y - gl_FragCoord.y );        // Flip Y Coordnate so origin is Upper Left 
    float grad      = grid( fragCoord, maxGridSize, 1.5 ) * grid( fragCoord, minGridSize, 1.0 );
    
    out_color.a     = 1.0;
    out_color.rgb   = mix(
        rgb( 0x303030 ),
        rgb( 0x404040 ),
        1.0 - grad
    );
}`;
//#endregion

export default Grid;