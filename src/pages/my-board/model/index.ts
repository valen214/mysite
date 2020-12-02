
import { ItemStore } from "./store";


export class MyBoard
{
  public readonly store: ItemStore
  
  constructor(){
    this.store = new ItemStore();
  }

  periodicUpdate(){
    
  }
}


export * from "./items";
export * from "./store";