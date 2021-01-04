

export type Item = {
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
  data: BinaryType
} | {
  type: "folder"
  name?: string
  children?: string[]
} | {
  type: "text"
  title?: string
  content?: any
})

export type ItemFolder = Item & {
  type: "folder"
};
