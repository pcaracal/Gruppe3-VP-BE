import fs from 'fs';

export interface Item {
  id?: number;
  title?: string;
  status?: boolean;
  created_at?: number;
  fk_user_id?: number;
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

export const getItems = async () => {
  return new Promise<Item[]>(async (resolve, reject) => {
    try {
      const data = await getData();
      resolve(data.items);
    } catch (error) {
      reject(error);
    }
  });
}

export const addItem = async (item: Item) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let data = await getData();
      item.id = data.next_item_id;
      item.created_at = Date.now();

      data.items.push(item);
      data.next_item_id++;
      await writeData(data);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const deleteItemById = async (id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let data = await getData();
      data.items = data.items.filter(item => item.id != id);

      await writeData(data);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const deleteAllItemsByUserId = async (fk_user_id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let data = await getData();
      data.items = data.items.filter(item => item.fk_user_id != fk_user_id);

      await writeData(data);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export const putHandler = async (id: number, item: Item) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let data = await getData();
      data.items = data.items.map((v) => {
        if (v.id === id) {
          return ({
            id: id,
            title: item.title || v.title,
            status: item.status || v.status,
            created_at: v.created_at,
            fk_user_id: v.fk_user_id
          });
        }
        else return (v);
      });

      await writeData(data);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}