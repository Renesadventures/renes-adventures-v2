import { SchemaTypeDefinition } from 'sanity'

import experience from './experience'
import blogPost from './blogPost'
import gallery from './gallery'
import product from './product'
import author from './author'

export const schemaTypes: SchemaTypeDefinition[] = [
  experience,
  blogPost,
  gallery,
  product,
  author,
]

