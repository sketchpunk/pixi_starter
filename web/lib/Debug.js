class Debug{
    static clog( msg, fgColor="#00ffff", bgColor="#030307" ){
        console.log( `%c ${msg} `, `color: ${fgColor}; background: ${bgColor}; padding:5px 0;` );
    }
}

export default Debug;