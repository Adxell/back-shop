import { IsString, MinLength } from "class-validator";

export class NewMessajeDto {
    
    @IsString()
    @MinLength(1)
    message: string
}