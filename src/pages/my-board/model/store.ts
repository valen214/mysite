
import type { Item } from "./items";

export class ItemStore
{
  private store: Map<string, Item> = new Map<string, Item>();
  constructor(){

  }

  listItem<B extends boolean>(
      id: string, local: B
  ): B extends true ? Item[] : Promise<Item[]>
  listItem(id: string, local: boolean = false): Promise<Item[]> | Item[] {

    if(local){
      let item = this.store.get(id);
      if(item.type !== "folder"){
        throw new Error("non folder item does not have children");
      }
      return item.children.map(id => this.store.get(id));

    } else{
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
      id: string
  ): Promise<Item> {
    console.log("downloadItem: downloading item#" + id);
    let item = localStorage.getItem(id);
    if(item){
      return JSON.parse(item);
    } else{
      return null;
    }
  }

  async uploadItem(
      item: Item
  ){
    localStorage.setItem(item.id, JSON.stringify(item));
  }
}
