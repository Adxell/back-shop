export const fileFilter = (req: Express.Request, file: Express.Multer.File, callBack: Function ) => {
    
    if ( !file ) return callBack(new Error('File is emty'), false)
    
    const fileExptension = file.mimetype.split('/')[1]
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

    if ( validExtensions.includes( fileExptension )) {
        return callBack(null, true)
    }
    callBack(null,false)
}