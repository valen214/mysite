
import type { Item } from "./items";
import { generateID, toID } from "./util";

/**
 * ItemStore is only responsible for maintaining local cache
 * for now
 * ItemStore::store is the local cache
 * and assume localStorage is the remote
 */
export class ItemStore
{
  private store: Map<string, Item> = new Map<string, Item>();
  constructor(){

  }

  set(item: Item){
    this.store.set(item.id, item);
  }

  // get<B extends boolean>(id: string, local?: B): B extends false ? Promise<Item> : Item
  get(id: string): Item
  get(id: string, local?: true): Item
  get(id: string, local: false): Promise<Item>
  get(id: string, local: boolean = true): Item | Promise<Item>{
    let item: Item | Promise<Item>;
    if(local){
      item = this.store.get(id);
    } else {
      item = this.downloadItem(id);
    }

    return item;
  }

  createItem(
    arg?: Omit<Item, "id">
  ){
    let item: Item = {
      id: generateID(),
      type: arg?.type,
      ...arg,
    } as Item;

    this.set(item);
    return item;
  }

  listItem<B extends boolean>(
    id: string, local?: B
  ): B extends true ? Item[] : Promise<Item[]>
  listItem(id: string, local: boolean = false): Promise<Item[]> | Item[] {
    if(!id){
      return [];
    }

    if(local){
      let item = this.store.get(id);
      if(item.type !== "folder"){
        throw new Error("non folder item does not have children");
      }
      return item.children.map(id => this.store.get(id));

    } else {
      return this.downloadItem(id).then(item => {
        if(item.type !== "folder"){
          throw new Error("non folder item does not have children");
        }
        return item;
      }).then(item => Promise.all(
        item.children.map(id => this.downloadItem(id))
      ));
    }
  }

  async downloadItem(
    id: string,
    overwrite?: boolean
  ): Promise<Item> {
    console.log("downloadItem: downloading item#" + id);
    let unparsed_item = localStorage.getItem(id);
    if(!unparsed_item){
      return null;
    }

    let item: Item = JSON.parse(unparsed_item);

    if(overwrite){
      this.set(item);
    }

    return item;
  }

  async uploadItem(
    arg: Item | string
  ){
    let item: Item;
    if(typeof arg === "string"){
      item = this.get(arg);
    } else {
      item = arg;
    }
    localStorage.setItem(item.id, JSON.stringify(item));
  }
}
