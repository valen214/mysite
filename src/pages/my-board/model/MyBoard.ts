
import EventTarget, { EventListener } from "./EventTarget";
import type { Item } from "./index";
import { ItemStore } from "./store";
import { generateID, toID } from "./util";

// https://stackoverflow.com/questions/26948400/typescript-how-to-extend-two-classes

interface MyBoard extends EventTarget {
  dispatch(event: "activeitemchange", id: string): void
  dispatch(event: "createitem", id: string): void
  dispatch(event: string, data: any): void

  on(event: "activeitemchange", listener: EventListener<string> ): MyBoard
  on(event: string, listener: EventListener): any | void
}
class MyBoard
{
  public readonly store: ItemStore

  private _active_item_id: string;
  set active_item_id(id: string){
    this._active_item_id = id;
    this.dispatch("activeitemchange", id);
  }
  get active_item(): Item { return this.store.get(this._active_item_id, true); }

  private _current_item_hierarchy: string[] = [];
  get current_item_hierarchy(){ return this._current_item_hierarchy; }


  constructor(){
    this.store = new ItemStore();
    this.getRootItem().then(item => {
      this.viewItem(item);
    });
  }

  periodicUpdate(){
    
  }

  createItem(
      arg?: Omit<Item, "id">,
      parent?: Item
  ){
    let item = this.store.createItem(arg);

    if(parent){
      let parent_id = toID(parent);
      let parent_item = this.store.get(parent_id);

      if(parent_item.type === "folder"){
        if(parent_item.children){
          parent_item.children.push(item.id);
        } else {
          parent_item.children = [ item.id ];
        }

        item.parent = parent_id;

        this.store.set(parent_item);
      }
    }

    this.active_item_id = item.id;
    this._current_item_hierarchy.push(item.id);
    this.dispatch("createitem", item.id);
  }

  saveItem(item: Item, parent?: string | Item){
    this.store.uploadItem(item);
    this.store.downloadItem(toID(parent)).then(p => {
      if(p.type === "folder"){
        p.children.push(item.id);
      }
    })
  }

  viewItem(id: string): Promise<Item>
  viewItem(item: Item): Promise<void>
  async viewItem(arg: string | Item): Promise<Item | void> {
    if(!arg){
      return null;
    }
    let id: string = toID(arg);

    try{
      let item = await this.store.downloadItem(id);
      this._active_item_id = item.id;
      if(typeof arg === "string"){
        return item;
      } else{
        Object.assign(arg, item);
        return;
      }
    } catch(e){
      console.log("MyBoard.ts::viewItem():", e);
    }

  }

  async getRootItem(): Promise<Item> {
    let root = localStorage.getItem("ROOT_ITEM_ID");
    if(root){
      return this.store.downloadItem(root);
    } else {
      let id = generateID();
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

function applyMixins(derivedConstructor: any, constructors: any[]){
  constructors.forEach(baseConstructor => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach(name => {
      console.log(name);
      Object.defineProperty(
        derivedConstructor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseConstructor.prototype, name)
      );
    })
  })

  console.log(derivedConstructor);

  return derivedConstructor
}
applyMixins(MyBoard, [ EventTarget ]);

console.log(EventTarget);



export default MyBoard;