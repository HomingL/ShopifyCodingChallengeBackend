class image {
  title: string
  file: Express.Multer.File
  owner_id: string
  isPublic: boolean | string
  constructor(title: string, file: Express.Multer.File, owner_id: string, isPublic: boolean| string) {
    this.title = title;
    this.file = file;
    this.owner_id = owner_id;
    this.isPublic = isPublic;
  }
}

export default image;
