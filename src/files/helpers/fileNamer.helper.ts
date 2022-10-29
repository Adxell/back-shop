import { v4 as uuid } from 'uuid'

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callBack: Function ) => {
        
    const fileExptension = file.mimetype.split('/')[1]
    const fileName = `${uuid()}.${fileExptension}`;
    callBack(null, fileName)
}