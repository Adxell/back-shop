import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./";

@Entity({name: 'products_images'})
export class ProductImage {
    
    @ApiProperty({
        example: "627",
        description: "Id image"
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: "URl image"
    })
    @Column('text')
    url: string;
    
    @ManyToOne(
        () => Product, 
        product => product.images, 
        { onDelete : 'CASCADE' }
    )
    product: Product
} 