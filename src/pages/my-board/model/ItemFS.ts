import { base64ToBlob, binaryToBase64 } from "./util";

export type ItemMeta = {
  id: string
  type: "image" | "folder" | "text"
  download_time?: number
  icon?: string | BinaryType
  thumbnail?: string | BinaryType
  parent?: string | string[]
  modified?: boolean
} & ({
  type: "image"
  title?: string
} | {
  type: "folder"
  name?: string
} | {
  type: "text"
  title?: string
})

export type ItemFolder = ItemMeta & {
  type: "folder"
};



type DataType = string | BinaryType | object

export interface ItemFS
{
  write(id: string, data: DataType): void
  writeMeta(meta: ItemMeta): void
  read(id: string): Promise<DataType>
  readMeta(id: string, fields: string[]): Promise<Partial<ItemMeta>>
}

class LocalStorageItemFS implements ItemFS
{
  async write(id: string, data: DataType): Promise<void> {
    if(typeof data === "string"){

      localStorage.setItem(id, data);
    } else if("size" in data){
      let blob = data as any as BinaryType;
      console.log("item data is binary");
      let base64 = await binaryToBase64(blob);
      localStorage.setItem(id, base64);
    } else {
      console.log("item data is object");
      localStorage.setItem(id, JSON.stringify(data));
    }
  }
  writeMeta(meta: ItemMeta): void {
    localStorage.setItem(meta.id + "-meta", JSON.stringify(meta));
  }
  async read(id: string): Promise<DataType> {
    let meta = await this.readMeta(id, [ "type" ]);
    let item = localStorage.getItem(id);
    switch(meta.type){
    case "folder":
      return JSON.parse(item);
    case "text":
      return item;    
    default:
    case "image":
      let blob = await base64ToBlob(item);
      return await blob.arrayBuffer();
    }

  }
  async readMeta(id: string, fields?: Array<keyof ItemMeta>): Promise<Partial<ItemMeta>> {
    let raw = localStorage.getItem(id + "-meta");
    let meta: ItemMeta = JSON.parse(raw);
    
    return meta;
  }
}


export interface ItemStore
{

}
export class ItemStore
{
  private itemFS = new LocalStorageItemFS();
  
  constructor(){

  }
}
