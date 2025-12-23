import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'renes-adventures-v2',
  title: "Rene's Adventures",
  
  projectId: 't58ax63x',
  dataset: 'production',
  
  basePath: '/studio',
  
  plugins: [deskTool(), visionTool()],
  
  schema: {
    types: schemaTypes,
  },
})
