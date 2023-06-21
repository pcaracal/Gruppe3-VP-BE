import fs from 'fs';

export interface Item {
  id: number;
  title: string;
  status: boolean;
  created_at: number;
  fk_user_id: number;
}

export interface Data {
  items: Item[];
  next_item_id: number;
}

export const getData = async () => {
  return new Promise<Data>((resolve, reject) => {
    fs.readFile('./data.json', (err, buffer: Buffer) => {
      if (err) reject("Get data unsuccessful.");
      else {
        resolve(JSON.parse(buffer.toString()));
      }
    });
  });
}

export const writeData = async (data: Data) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile('./data.json', JSON.stringify(data), (err) => {
      if (err) reject("Write data unsuccessful.");
      else resolve();
    });
  });
}