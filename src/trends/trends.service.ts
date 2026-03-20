import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrendDto } from './dto/create-trend.dto';
import { UpdateTrendDto } from './dto/update-trend.dto';
import { Trend } from './entities/trend.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrendsService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>
  ){}

  async createTrendFromNewTweet(hashtag: DeepPartial<Trend>[]){
    try{
      if(!hashtag.length){
        return null;
      }

      const incoming = hashtag
        .map((item) => item.hashtag)
        .filter((value): value is string => !!value);

      if(!incoming.length){
        return null;
      }

      // Contar quantas vezes cada hashtag aparece
      const countMap = new Map<string, number>();
      incoming.forEach((tag) => {
        countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
      });

      // Buscar hashtags existentes
      const existing = await this.trendRepository.find({
        where: { hashtag: In(Array.from(countMap.keys())) }
      });

      const existingMap = new Map(existing.map((item) => [item.hashtag, item]));

      const updates: Trend[] = [];
      const creates: DeepPartial<Trend>[] = [];

      // Separar em atualizações e criações
      countMap.forEach((count, tag) => {
        if(existingMap.has(tag)){
          const trend = existingMap.get(tag)!;
          trend.count = (Number(trend.count) || 0) + count;
          updates.push(trend);
        }else{
          creates.push({ hashtag: tag, count });
        }
      });

      // Atualizar existentes
      if(updates.length > 0){
        await this.trendRepository.save(updates);
      }

      // Criar novos
      if(creates.length > 0){
        const newTrends = this.trendRepository.create(creates);
        await this.trendRepository.save(newTrends);
      }

      return { created: creates.length, updated: updates.length };
    }catch(error){
      throw new HttpException('Error creating trend: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findTrend(hashtag: string){
    try{
      if(!hashtag.startsWith('#')){
        hashtag = '#' + hashtag;
      }
      return await this.trendRepository.findOne({ where: { hashtag: hashtag.toLowerCase() } });
    }catch(error){
      throw new HttpException('Error finding trend: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTrandins(){
    try{
      const trendins = await this.trendRepository.find({
        select:{
          hashtag: true,
          count: true
        },
        order:{
          count:'DESC'
        },
        take: 4
      });

      return trendins;
    }catch(error){
      throw new HttpException('Error fetching trends: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
