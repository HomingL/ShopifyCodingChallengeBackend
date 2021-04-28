class image {
  title: string
  file: Express.Multer.File
  owner_id: string
  isPublic: boolean
  constructor(title: string, file: Express.Multer.File, owner_id: string, isPublic: boolean) {
    this.title = title;
    this.file = file;
    this.owner_id = owner_id;
    this.isPublic = isPublic;
  }
}

export default image;
