import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';
import { validRoles } from '../auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Products was created success', type: Product})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser( ) user:User
  ) {
    return this.productsService.create(createProductDto, user);
  }
  
  @Get()
  @ApiResponse({ status: 200, description: 'Get produts by limit or offset parameters'})
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }
  
  @Get(':term')
  @ApiResponse({ status: 200, description: 'Get product by title, id or slug'})
  @ApiResponse({ status: 404, description: 'Not found product'})
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }
  
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Updated product'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted product'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
