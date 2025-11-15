import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      where: { published: true },
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<News> {
    return this.newsRepository.findOne({ where: { id } });
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(createNewsDto);
    return this.newsRepository.save(news);
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    await this.newsRepository.update(id, updateNewsDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.newsRepository.delete(id);
  }
}
