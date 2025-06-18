import {Pet} from '../models/pet.model';
import { JsonDB, Config } from 'node-json-db';
import logger from '../middleware/logger';

export class PetService {
  private db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('db', true, false, '/'));

    this.initMinuteEvent();
  }

  private initMinuteEvent(){
    setInterval(async () => {
      const pets = await this.findAll();
      for (const pet of pets) {
        if(pet.status == 'dead') continue;
        pet.age++;
        if(pet.hunger > 70){
          pet.health -= 5;
        }else {
          pet.health -= 2;
        }
        pet.hunger += 3;
        pet.mood = (pet.health +(100 - pet.hunger))/2;
        await this.update(pet.id, pet);
        logger.info('Питомец обновлен' + JSON.stringify(pet));
      }
    }, 60 * 1000);
  }

  public async create(name: string) {
    const pets: Pet[] = (await this.db.exists("/pets")) ? await this.db.getData("/pets") : [];
    const pet: Pet = {
      id: Date.now(),
      age: 0,
      health: 100,
      hunger: 0,
      mood: 100,
      name,
      status: 'alive',
    };
    pets.push(pet);
    await this.db.push("/pets", pets);
    return pet;
  }

  public async findOne(id: number) {
    await this.db.reload();
    const pets: Pet[] = await this.db.getData('/pets');
    return pets.find(pet => pet.id === id);
  }


  public async update(id: number, pet: Pet) {
    await this.db.reload();
    let pets: Pet[] = await this.db.getData('/pets');
    const index = pets.findIndex(p => p.id === id);

    pet.health = Math.max(0, Math.min(100, pet.health));
    pet.hunger = Math.max(0, Math.min(100, pet.hunger));
    pet.mood = Math.max(0, Math.min(100, pet.mood));
    pet.status = this.validateStatus(pet);

    pets[index] = pet;
    await this.db.push("/pets", pets, true);
    return pet;
  }

  public async findAll() {
    await this.db.reload();
    const pets: Pet[] = await this.db.getData("/pets");
    return pets;
  }


  public async feed(index: number) {
    const pet = await this.findOne(index);
    if(!pet) throw new Error('Питомец не найден.');
    if(pet.status === 'dead') throw new Error('Питомец мертв, действие недоступно.');

    pet.hunger -= 30;
    pet.mood += 10;
    logger.info('Питомец покормлен' + JSON.stringify(pet))
    return await this.update(index, pet);
  }

  public async heal(index: number) {
    const pet = await this.findOne(index);
    if(!pet) throw new Error('Питомец не найден.');

    if(pet.status === 'dead'){
      throw new Error('Питомец мертв, действие недоступно.');
    }
    pet.health += 20;
    pet.hunger -= 10;
    logger.info('Питомец вылечен' + JSON.stringify(pet))
    return await this.update(index, pet);
  }
  public async play(index: number) {
    const pet = await this.findOne(index);
    if(!pet) throw new Error('Питомец не найден.');
    if(pet.status === 'dead') throw new Error('Питомец мертв, действие недоступно.');
    pet.hunger += 5;
    pet.mood += 15;
    logger.info('Питомец наигрался' + JSON.stringify(pet));
    return await this.update(index, pet);
  }

  private validateStatus(pet: Pet): 'alive' | 'sick' | 'dead'{
    if(pet.health <= 0 || pet.hunger >= 100) return 'dead';
    if(pet.health <= 30) return 'sick';
    return 'alive';
  }
}