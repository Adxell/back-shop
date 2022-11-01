import { UploadedFile, BadRequestException, Res, UseInterceptors, Param, Controller, Post, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { Response } from 'express'

import { diskStorage } from 'multer';

import { UseGuards } from '@nestjs/common'

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/';
import { RoleProtected } from 'src/auth/decorators/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { validRoles } from 'src/auth/interfaces/valid-roles';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticImage(imageName)
    res.sendFile(path)
  }

  @Post('products')
  @ApiResponse({ status: 201, description: 'Images was saved success'})
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related'})
  @RoleProtected( validRoles.superUser, validRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductFile(
    @UploadedFile() file: Express.Multer.File, 
  ){
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${ file.filename }`

    return {
      secureUrl
    }
  }
}
