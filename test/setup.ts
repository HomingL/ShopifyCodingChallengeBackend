import fs from 'fs';
import path from 'path';

afterAll(() => {
  fs.unlink(path.join(__dirname, '../db/test/users.db'), () => {
    fs.unlink(path.join(__dirname, '../db/test/images.db'), () => {});
  });
});