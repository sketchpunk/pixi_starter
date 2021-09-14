/* eslint-disable @typescript-eslint/no-explicit-any */
class ObjectPoolItem {
    constructor(obj) {
        this.inUse = false;
        this.obj = obj;
    }
}
class ObjectPool {
    constructor(fnNew = null) {
        this.items = [];
        this.avail = [];
        this.onNew = fnNew;
    }
    _createNew() {
        if (!this.onNew)
            return undefined;
        const i = new ObjectPoolItem(this.onNew());
        this.items.push(i);
        return i;
    }
    get() {
        const i = (this.avail.length != 0) ? this.avail.pop() : this._createNew();
        if (!i)
            return null;
        i.inUse = true;
        return i.obj;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    recycle(o) {
        let i;
        for (i of this.items) {
            if (i.obj === o) {
                i.inUse = false;
                this.avail.push(i);
                break;
            }
        }
        return this;
    }

    static nanoId( t=21 ){
        const r = crypto.getRandomValues( new Uint8Array( t ) );
        let n, e = "";
            
        for( ;t--; ){
            n  = 63 & r[ t ];
            e += ( n < 36 )? n.toString(36) : 
                 ( n < 62 )? ( n - 26 ).toString( 36 ).toUpperCase() : 
                 ( n < 63 )? "_" : "-";
        }
        return e;
    }
}
export default ObjectPool;
