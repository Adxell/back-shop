import { Controller, Get } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { SeedService } from './seed.service';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  
  @Get()
  executeSeed ( ) {
    return this.seedService.runSeed()
  }
}
