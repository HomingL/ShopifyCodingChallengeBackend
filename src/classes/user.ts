class user {
  _id: string
  saltedHash: string
  salt: string
  constructor(_id: string, salt: string, saltedHash: string) {
    this._id = _id;
    this.salt = salt;
    this.saltedHash = saltedHash;
  }
}

export default user;
