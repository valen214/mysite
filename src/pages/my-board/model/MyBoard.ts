
import EventTarget, { EventListener } from "./EventTarget";
import type { Item, ItemFolder } from "./index";
import { applyMixins } from "./meta";
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

  init(): void;
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
  init(){
    
  }

  periodicUpdate(){
    
  }

  async onCreateItemClick(){
    
  }

  async createItem(
      arg?: Omit<Item, "id">,
      parent?: Item
  ){
    console.log("creating item");
    fetch("/my-clip/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...arg,
        parent
      })
    }).then(res => res.text()
    ).then(res => {
      console.log(res);
    })


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
    this.dispatch("createitem", item.id);
  }

  modifyItem(item: Item){
    item.modified = true;
    this.store.set(item);
    this.dispatch("item_modified", item);
  }


  saveItem(item: Item, parent?: string | Item){
    fetch("/my-clip/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: "HELLO WORLD!"
    }).then(res => res.text()
    ).then(res => {
      console.log(res);
    });


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

applyMixins(MyBoard, [ EventTarget ]);

console.log(EventTarget);



export default MyBoard;