class image {
  title: string
  file: Express.Multer.File
  constructor(title: string, file: Express.Multer.File) {
    this.title = title;
    this.file = file;
  }
}

export default image;
