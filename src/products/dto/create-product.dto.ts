import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, MinLength, IsPositive, 
    IsOptional, IsInt, IsArray, IsIn
} from "class-validator";


export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Price product',
        default: 0,
        required: false,
        type: Number
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Description product',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Slug product',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Stock of products',
        required: false,
        type: Number
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Sizes of products',
        required: true,
        type: Array
    })
    @IsString({
        each: true
    })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'gender products',
        required: true,
        type: Array
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
    

    @ApiProperty({
        description: 'Tags products',
        required: true,
        type: Array
    })
    @IsString({
        each: true,
    })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Images products',
        required: false,
        type: Array
    })
    @IsString({
        each: true,
    })
    @IsArray()
    @IsOptional()
    images?: string[];
}
