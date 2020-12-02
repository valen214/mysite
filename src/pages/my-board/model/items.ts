

export type Item = {
  id: string
  download_time?: number
  icon?: string | BinaryType
  thumbnail?: string | BinaryType
} & ({
  type: "image"
  title?: string
  data: BinaryType
} | {
  type: "folder"
  name?: string
  children?: string[]
} | {
  type?: "text"
  title?: string
  content: any
})


export async function getItem(id: string): Promise<Item> {

  return [{
    type: "text",
    title: "HI",
    content: "OK",
  }, {
    type: "text",
    title: "ITEM 2",
    content: "HELO",
  }].reduce((l, r: any, i) => {
    r.id = i;
    l[i] = r;
    return l;
  }, {})[id];
}


export async function listItem(
    id?: string
): Promise<string[]>{
  return ["0", "1"];
}


export async function moveItem(
  id: string,
  target: string
){

}