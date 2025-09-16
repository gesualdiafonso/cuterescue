import fs from "fs/promises";
import clientPromise from "./services/useConnection.js";

async function seed(){
    const client = await clientPromise;
    const db = client.db("cuterescue");

    // Ler el json
    const users = JSON.parse( await fs.readFile("./data/users.json", "utf-8") );
    const pets = JSON.parse( await fs.readFile("./data/pets.json", "utf-8") );
    const locations = JSON.parse( await fs.readFile("./data/locations.json", "utf-8") );

    // Insertar los datos
    await db.collection("users").insertMany(users);
    await db.collection("pets").insertMany(pets);
    await db.collection("locations").insertMany(locations);

    console.log("Seed executed successfully");
    console.log("Data inserted: ", { user: users.length, pets: pets.length, locations: locations.length });
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error executing seed: ", {
        message: err.message,
        stack: err.stack,
    });
    process.exit(1);
});