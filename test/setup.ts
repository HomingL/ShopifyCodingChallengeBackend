import fs from 'fs';
import path from 'path';


// clean up database, and delete test upload directory
afterAll(() => {
  fs.unlink(path.join(__dirname, '../db/test/users.db'), () => {
    fs.unlink(path.join(__dirname, '../db/test/images.db'), () => {
      fs.rmdirSync(path.join(__dirname, '../src/uploads'), {recursive: true});
    });
  });
});