import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { startup } from "./startup";
import { playlist } from "./playlist";
import group from "./group";
import  { confession } from "./connfession";



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist, group,confession ]};