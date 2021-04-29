import fs from 'fs';
import path from 'path';


beforeAll(() => console.log('beforeAll'));
afterAll(() => {
  fs.rmdir(path.join(__dirname, '../db/test'), { recursive: true }, () => {});
});