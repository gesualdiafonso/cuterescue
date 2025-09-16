import crypto from 'crypto';
import Users from './Users.js';
import Location from './Location.js';
import clientPromise from '../services/useConnection.js';

class Pet {

    constructor() {
        this.collectionName = 'pets';
        this.locationService = new Location();
        this.userService = new Users();
    }

    async getCollection() {
        const client = await clientPromise;
        const db = client.db('cuterescue');
        return db.collection(this.collectionName);
    }

    async getAll() {
        // const pets = await this.readJSON();
        // return pets || [];
        const collection = await this.getCollection();
        return await collection.find({}).toArray();

    }


    async addPet(pet) {
        // Lê pets

        const collection = await this.getCollection();
        
        // Criamos los IDs
        const uniqueId = crypto.randomBytes(8).toString('hex');
        const chipId = `CHIP-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

        // Criar novo pet
        const newPet = {
            id: uniqueId,
            chip_id: chipId,
            ...pet
        };

        // Salvar nuevo pet en el MongoDB
        await collection.insertOne(newPet);

        const initialLocation = {
            lat: 0,
            lng: 0,
            timestamp: new Date().toISOString()
          };
          
          // Salva no Mongo a localização
          const savedLocation = await this.locationService.addLocation(chipId, initialLocation);
          
          // Atualiza o pet com essa localização
          await collection.updateOne(
            { id: uniqueId },
            { $set: { ultima_localizacion: savedLocation } }
          );
          
          // Também devolve já atualizado
          newPet.ultima_localizacion = savedLocation;


        // Atualizar dueño del pet
        if (pet.dueno_id){
            const owner = await this.userService.getById(pet.dueno_id);
            if(owner) {
                owner.pets = owner.pets || [];
                owner.pets.push(uniqueId);
                await this.userService.updateUser(pet.dueno_id, { pets: owner.pets} );  
            }
        }


        return newPet;
    }

    async getById(id) {
        // const pets = await this.readJSON();
        // return pets.find(p => p.id === id) || null;

        const collection = await this.getCollection();
        return await collection.findOne({ id });
    }

    async updatedPet(id, updatedPet) {

        const collection = await this.getCollection();

        // Se estiver tentando atualizar a localização, cria ou atualiza ela
        if (updatedPet.ultima_localizacion) {
            const chip = await collection.findOne({ id });
            if (chip) {
                await this.locationService.updateLocation(
                    chip.chip_id,
                    updatedPet.ultima_localizacion
                );
            }
        }
    
        // Atualiza os outros campos do pet
        const result = await collection.findOneAndUpdate(
            { id },
            { $set: updatedPet },
            { returnDocument: 'after' }
        );
    
        return result.value;
    }

    async deleteById(id) {

        const collection = await this.getCollection();
        const pet = await collection.findOne({ id });
        if (!pet) return false;

        // Remover pet do dono
        if (pet.dueno_id){
            const owner = await this.userService.getById(pet.dueno_id);
            if(owner) {
                owner.pets = owner.pets || [];
                owner.pets = owner.pets.filter(p => p !== pet.id);
                await this.userService.updateUser(pet.dueno_id, { pets: owner.pets} );  
            }
        }

        // Remover el pet
        const result = await collection.deleteOne({ id });

        // Remover localización del pet
        await this.locationService.deleteLocation(pet.chip_id);

        return result.deletedCount > 0;
    }
}

export default Pet;