import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne} from 'typeorm'

import {ApiProperty} from '@nestjs/swagger'

import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './';


@Entity({name: 'products'})
export class Product {

    @ApiProperty({ 
        example: '2dc68f71-47e4-4ce2-92b3-2e1e66360fe4', 
        description: 'ProductID', 
        uniqueItems: true 
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "Men's Raven Lightweight shirt", 
        description: 'ProductTitle', 
        uniqueItems: true 
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 5, 
        description: 'ProductPrice', 
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet consectetur adipiscing elit inceptos, maecenas congue feugiat pellentesque pretium nam in purus aenean, mattis parturient imperdiet malesuada integer lacus habitant. Posuere tempus et consequat morbi ultrices a ante sed fermentum montes, litora convallis facilisis platea eu vivamus vel velit cum, ornare purus primis in habitant donec quam sociis euismod. Enim viverra et ante habitant litora ridiculus nostra accumsan, pretium mollis vitae praesent penatibus cras neque phasellus, ultrices est orci dignissim augue nunc pulvinar.', 
        description: 'ProductDescription', 
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: "mens_raven_lightweight_shirt", 
        description: 'ProductSlug',
        uniqueItems: true 
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10, 
        description: 'ProductStock', 
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: [
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ], 
        description: 'ProductSizes', 
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: "men",
        description: "ProductGender"
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['Shirt', 'Men'],
        description: 'ProductTags'
    })
    @Column('text',{
        array: true,
        default: []
    })
    tags: string[]
    
    @ApiProperty({
        example: ["http://localhost:3000/api/files/product/ec73ee28-47dd-4a19-bacc-03075e620a9d.jpeg", "http://localhost:3000/api/files/product/ec73ee28-47dd-4a19-bacc-03075e620a23d.jpeg"],
        description: 'ProductImages'
    })
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        {cascade: true, eager: true}
    )
    images?: ProductImage[]
    
    @ManyToOne(
        () => User,
        (user) => user.product, 
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert(){
        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replaceAll(' ', '_');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replaceAll(' ', '_');
    }
}
