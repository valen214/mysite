
import type { Item } from "./index";
import { ItemStore } from "./store";
import { randomstring } from "../../util";

export class MyBoard
{
  public readonly store: ItemStore
  private _active_item: Item;
  get active_item(){
    return this._active_item;
  }
  
  constructor(){
    this.store = new ItemStore();
    this.getRootItem().then(item => {
      this.viewItem(item);
    })
  }

  periodicUpdate(){
    
  }

  viewItem(arg: string | Item){
    let id: string;
    if(typeof arg === "string"){
      id = arg;
    } else{
      id = arg.id;
    }


  }

  getLastBrowsedItem(){

  }

  async getRootItem(){
    let root = localStorage.getItem("ROOT_ITEM_ID");
    if(root){
      return this.store.downloadItem(root);
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
      this.store.uploadItem(item);
      return item;
    }
  }
}