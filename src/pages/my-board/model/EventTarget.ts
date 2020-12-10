
type Event = any

export interface EventListener<T = any> {
  (event_data: T): void;
}

interface EventListenerEntry {
  listener: EventListener
  filter?: (event: Event) => boolean
}

export default class EventTarget
{
  protected __event_listeners: Map<string, EventListenerEntry[]>;

  protected get _event_listeners(){
    if(this.__event_listeners) return this.__event_listeners;
    
    this.__event_listeners = new Map<string, EventListenerEntry[]>();
    return this.__event_listeners;
  }

  constructor(){
    console.log("CALLED");
  }

  on(event: string, listener: EventListener): any | void {
    if(this._event_listeners.has(event)){
      this._event_listeners.get(event).push({ listener });
    } else {
      this._event_listeners.set(event, [ { listener } ]);
    }
    return this;
  }
  protected dispatch(event: string, data?: any){
    let listeners = this._event_listeners.get(event);
    if(!listeners) return;
    for(let entry of listeners){
      if(typeof entry.filter === "function"){
        if(!entry.filter(data)) continue;
      }
      if(typeof entry.listener === "function"){
        entry.listener(data);
      }
    }
  }
}


// https://dev.to/angular/decorators-do-not-work-as-you-might-expect-3gmj
export function EventTargetDecor(constructor: Function){

}