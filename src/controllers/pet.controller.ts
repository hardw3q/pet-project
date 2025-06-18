import { Router } from 'express';
import {PetService} from '@src/services/pet.service';
import {CreatePetDto} from '@src/controllers/dto/pet.create.dto';
import logger from '../middleware/logger';
const router = Router();
const petService = new PetService();

router.post('/', async (req, res) => {
  try {
    const { name }: CreatePetDto = req.body;
    if(!name) {
      res.status(400).json({error: 'Поле name не должно быть пустым.'});
    }
    const newPet = await petService.create(name);
    res.status(201).json(newPet);
  } catch (e) {
    logger.error('Ошибка при создании питомца:', e);
    res.status(500).json({ error: String(e)});
  }
});
router.get('/', async (req, res) => {
  try {
    const { id }  = req.query;
    if(!id) {
      res.status(400).json({error: 'Поле id не должно быть пустым.'});
    }
    const pet = await petService.findOne(Number(id));
    if(!pet) res.status(404).json({error: 'Питомец не найден'})
    res.json(pet);
  } catch (e) {
    logger.error('Ошибка при получении питомца:', e);
    res.status(500).json({ error: String(e)});
  }
});

router.post('/feed', async (req, res) => {
  try {
    const { id }  = req.query;
    if(!id) {
      res.status(400).json({error: 'Поле index не должно быть пустым.'});
    }
    res.status(201).json(await petService.feed(Number(id)));
  } catch (e) {
    logger.error('Ошибка при кормлении питомца:', e);
    res.status(500).json({ error: String(e)});
  }
});
router.post('/heal', async (req, res) => {
  try {
    const { id }  = req.query;
    if(!id) {
      res.status(400).json({error: 'Поле id не должно быть пустым.'});
    }
    res.status(201).json(await petService.heal(Number(id)));
  } catch (e) {
    logger.error('Ошибка при лечении питомца:', e);
    res.status(500).json({ error: String(e)});
  }
});

router.post('/play', async (req, res) => {
  try {
    const { id }  = req.query;
    if(!id) {
      res.status(400).json({error: 'Поле id не должно быть пустым.'});
    }
    res.status(201).json(await petService.play(Number(id)));
  } catch (e) {
    logger.error('Ошибка при игре с питомцем:', e);
    res.status(500).json({ error: String(e)});
  }
});

export default router;
