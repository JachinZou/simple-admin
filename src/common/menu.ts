import Vue from 'vue'
interface NestedMenu {
  name: string;
  children: Menu[];
  route?: string;
  getParams?(instance: Vue): object;
}

interface SingleMenu {
  name: string;
  route: string;
  getParams?(instance: Vue): object;
}

export type Menu = NestedMenu | SingleMenu

export type MenuList = Menu[]

const Menus: MenuList = [
  {
    name: '首页',
    route: 'home'
  },
  {
    name: '关于我们',
    children: [
      {
        name: '1-1',
        children: [
          {
            name: '1-1-1',
            route: 'ttt'
          },
          {
            name: '1-1-2',
            route: 'sss'
          }
        ]
      },
      {
        name: '1-2',
        route: 'asdf1'
      }
    ]
  },
  {
    name: '注意事项',
    children: [{
      name: '2-1',
      route: 'asdf'
    }]
  }
]

export default Menus
