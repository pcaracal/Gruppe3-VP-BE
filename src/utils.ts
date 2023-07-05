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
  users: User[];
  next_user_id: number;
}

export const getData = async () => {
  return new Promise<Data>(async (resolve, reject) => {
    fs.readFile('./src/data.json', (err, buffer: Buffer) => {
      if (err) reject("Get data unsuccessful.");
      else {
        resolve(JSON.parse(buffer.toString()));
      }
    });
  });
}

export const writeData = async (data: Data) => {
  return new Promise<void>(async (resolve, reject) => {
    fs.writeFile('./src/data.json', JSON.stringify(data), (err) => {
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

export const getItemsByUserId = async (uid: number) => {
  return new Promise<Item[]>(async (resolve, reject) => {
    try {
      resolve((await getItems()).filter(i => i.fk_user_id === uid));
    } catch (error) {
      reject(error)
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

export const patchHandler = async (id: number, item: Item) => {
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



export interface User {
  id: number;
  code: number;
}

export interface Session {
  user?: User;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session: Session;
      sessionID: string;
    }
  }
}

// TODO: signup and get cats instead of fixed array yes
export const getUsers = async () => {
  return new Promise<User[]>(async (resolve, reject) => {
    try {
      const data = await getData();
      resolve(data.users);
    } catch (error) {
      reject(error);
    }
  });
}

export const createUser = async (code: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      let data = await getData();
      data.users.push({
        id: data.next_user_id,
        code: code
      });
      data.next_user_id++;
      await writeData(data);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}