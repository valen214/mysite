
import type { Item } from "./items";

import { randomstring } from "../../util"

export class ItemStore
{
  private store: Map<string, Item> = new Map<string, Item>();
  constructor(){

  }

  getLastBrowsedItem(){

  }

  async getRootItem(): Promise<Item & { type: "folder" }> {
    let root = localStorage.getItem("ROOT_ITEM_ID");
    if(root){
      let item = await this.downloadItem(root);
      return item as (Item & { type: "folder" });
    } else {
      let id = (
        r => `${r(4)}-${r(4)}-${r(6)}-${r(4)}`
      )(randomstring);
      let item: Item = {
        id,
        type: "folder",
        children: []
      };

      localStorage.setItem("ROOT_ITEM_ID", id);
      this.uploadItem(item);
      return item;
    }
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
