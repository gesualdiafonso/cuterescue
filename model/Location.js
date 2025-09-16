
import clientPromise from '../services/useConnection.js';


class Location{

    // locations = [];
    // path = './data/locations.json'

    // constructor( locations = [] ){
    //     this.locations = locations
    // }

    constructor(){
        this.collectionName = 'locations';
    }

    // async saveJSON() {
    //     const data = JSON.stringify(this.locations || [], null, 2);
    //     await fs.writeFile(this.path, data);
    // }

    // async readJSON() {
    //     try {
    //         const data = await fs.readFile(this.path, 'utf-8');
    //         if (!data) return [];  // <-- se arquivo vazio, retorna array vazio
    //         return JSON.parse(data);
    //     } catch (error) {
    //         if (error.code === 'ENOENT') return []; // arquivo não existe, retorna array vazio
    //         console.log('Error al leer el archivo', error);
    //         return [];
    //     }
    // }

    async getCollection(){
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async getAll(){
        // const location = await this.readJSON();
        // return location || this.locations;
        const collection = await this.getCollection();
        return await collection.find({}).toArray();

    }

    async addLocation(chip_id, coords = { lat: 0, lng: 0, timestamp: new Date().toISOString() } ) {
        // this.locations = await this.readJSON() || [];  // garante que é um array
        // const newLocation = {
        //     chip_id,
        //     lat: 0, 
        //     lng: 0, 
        //     timestamp: new Date().toISOString()
        // };
        // this.locations.push(newLocation);
        // await this.saveJSON();
        // return newLocation;
        const collection = await this.getCollection();
        const newLocation = {
            chip_id,
            lat: coords.lat,
            lng: coords.lng,
            timestamp: coords.timestamp || new Date().toISOString()
        };

        await collection.insertOne(newLocation);

        return newLocation;
    }

    async getLocationById( chip_id ){
        // const locations = await this.readJSON();
        // return locations.find( l => l.id === id ) || null
        const collection = await this.getCollection();
        return await collection.findOne( { chip_id } ) || null;
    }

    async updateLocation( chip_id, updatedLocation ){
        // const locations = await this.readJSON();
        // const index = locations.findIndex( l => l.id === id );
        // if ( index !== -1 ){
        //     locations[index] = { 
        //         ...locations[index], 
        //         ...updatedLocation
        //     }
        //     this.locations = locations; 
        //     await this.saveJSON();
        //     return locations[index];
        // }
        // return null;

        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate(
            { chip_id: chip_id },
            { $set: updatedLocation },
            { returnDocument: 'after' }
        );

        return result.value;

    }

    async deleteLocation( chip_id ){
        // const locations = await this.readJSON();
        // const index = locations.findIndex( l => l.id === id );
        // if (index !== -1 ){
        //     locations.splice( index, 1 );
        //     this.locations = locations;
        //     await this.saveJSON();
        //     return true;
        // }
        // return false

        const collection = await this.getCollection();
        const result = await collection.deleteOne( { chip_id } );

        return result.deletedCount > 0;
    }

}

export default Location;