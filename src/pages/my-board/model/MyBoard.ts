
import EventTarget, { EventListener } from "./EventTarget";
import type { Item, ItemFolder } from "./index";
import { ItemStore } from "./store";
import { generateID, toID } from "./util";

// https://stackoverflow.com/questions/26948400/typescript-how-to-extend-two-classes

interface MyBoard extends EventTarget {
  dispatch(event: "activefolderchange"): void
  dispatch(event: "createitem", id: string): void
  dispatch(event: "activeitemchange", id: string): void
  dispatch(event: "activeitemmodified", item: Item): void
  dispatch(event: "saveactiveitem"): void
  dispatch(event: "item_modified", item: Item): void
  dispatch(event: string, data: any): void

  on(event: "activefolderchange", listener: EventListener<string[]>): MyBoard
  on(event: "activeitemchange", listener: EventListener<string> ): MyBoard
  on(event: "activeitemmodified", listener: EventListener<Item> ): MyBoard
  on(event: "saveactiveitem", listener: EventListener<void>): MyBoard
  on(event: "item_modified", listener: EventListener<Item>): MyBoard
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

  private __active_folder_id: string;
  set active_folder(folder: ItemFolder){
    this.__active_folder_id = folder.id;
    this.dispatch("activefolderchange", folder.children);
  }
  get active_folder(): ItemFolder {
    if(this.__active_folder_id){
      return this.store.get(this.__active_folder_id) as ItemFolder;
    }

    let active_item = this.active_item;
    let parent = active_item.parent;
    if(typeof parent === "string"){
      return this.store.get(parent) as ItemFolder;
    }
  }

  private _current_item_hierarchy: string[] = [];
  get current_item_hierarchy(){ return this._current_item_hierarchy; }


  constructor(){
    this.store = new ItemStore();
    this.loadLastWorkspace();


    console.log(this);
    window["app"] = this;
  }
  loadLastWorkspace(){
    this.getRootItem().then(item => {
      console.log("root item is", item);
      this.active_folder = item;
    });
  }

  periodicUpdate(){
    
  }

  private addChildToParent(child: Item, parent: ItemFolder){

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
        this.dispatch("activefolderchange", parent_item.children);
      }
    } else {
      this.getRootItem().then(root_item => {
        item.parent = root_item.id;
        root_item.children.push(item.id);
        this.dispatch("activefolderchange", root_item.children);
      })
    }

    this.active_item_id = item.id;
    this._current_item_hierarchy.push(item.id);
    this.dispatch("createitem", item.id);
  }

  modifyItem(item: Item){
    item.modified = true;
    this.store.set(item);
    this.dispatch("item_modified", item);
  }


  saveItem(item: Item, parent?: string | Item){
    delete item.modified;
    this.store.uploadItem(item);
    if(!parent){
      parent = this.active_folder;
    }
    console.log("saveItem: parent:", parent);
    
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
      this.active_item_id = item.id;
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

  async getRootItem(): Promise<ItemFolder> {
    let root = localStorage.getItem("ROOT_ITEM_ID");
    if(root){
      let root_item: ItemFolder = this.store.get(root) as ItemFolder;
      if(root_item) return root_item;

      root_item = await this.store.downloadItem(root, true) as ItemFolder;
      if(root_item) return root_item;
    }

    let id = generateID();
    let item: Item = {
      id,
      type: "folder",
      children: []
    };

    this.store.set(item);
    localStorage.setItem("ROOT_ITEM_ID", id);
    await this.store.uploadItem(item);
    return item;
  }
}

function applyMixins(derivedConstructor: any, constructors: any[]){
  constructors.forEach(baseConstructor => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach(name => {
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