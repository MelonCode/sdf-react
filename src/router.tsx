import { ComponentType, FC, Fragment, lazy } from 'react'
import { RouteObject } from 'react-router-dom'

interface ComponentModule {
  default: ComponentType
}

interface RootElements {
  _app: FC
  404: FC
}

const pages = import.meta.glob<ComponentModule>('/src/pages/**/[a-z[]*.tsx')

const root = import.meta.glob<ComponentModule>('/src/pages/(_app|404).tsx', {
  eager: true,
  import: 'default',
})

export const rootElements = Object.keys(root).reduce((preserved, file) => {
  const key = file.replace(/\/src\/pages\/|\.tsx$/g, '')
  return { ...preserved, [key]: root[file] }
}, {}) as RootElements

const { _app: App = Fragment, 404: NotFound = () => <h1> Not Found </h1> } =
  rootElements

const pageRoutes = Object.keys(pages).map((route) => {
  const path = route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')

  const component = pages[route]
  const LazyComponent = lazy(component)

  return {
    path,
    element: <LazyComponent />,
  }
})

pageRoutes.push({ element: <NotFound />, path: '*' })

export const routes: RouteObject[] = [
  { element: <App />, children: pageRoutes },
]
