import Vue from 'vue'
import VueRouter from 'vue-router'

const signInUp = () => import('@/views/signInUp/signInUp.vue')
const home = () => import('@/views/home/home.vue')
const homePage = () => import('@/views/homePage/homePage.vue')
const content = () => import('@/views/content/content.vue')
const mine = () => import('@/views/mine/mine.vue')
const write = () => import('@/views/write/write.vue')
const rewrite = () => import('@/views/write/rewrite.vue')
const admin = () => import('@/views/admin/admin.vue')
const connection = () => import('@/views/connection/connection.vue')

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/signInUp'
  },
  {
    path: '/signInUp',
    name: 'signInUp',
    component: signInUp
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/homePage',
    children: [{
        path: '/homePage',
        name: 'homePage',
        component: homePage
      },
      {
        path: '/content/:id',
        name: 'content',
        component: content
      },
      {
        path: '/mine',
        name: 'mine',
        component: mine
      },
      {
        path: '/write',
        name: 'write',
        component: write
      },
      {
        path: '/rewrite',
        name: 'rewrite',
        component: rewrite
      },
      {
        path: '/admin',
        name: 'admin',
        component: admin
      },
      {
        path: '/connection',
        name: 'connection',
        component: connection
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (sessionStorage.getItem('message')) {
//     const role = sessionStorage.getItem('message').split(',')[1]
//     if (role === '0') {
//       const arr0 = ['mine', 'write', 'rewrite']
//       arr0.forEach(item => {
//         if (item === 'rewrite') {
//           router.addRoute('home', {
//             path: `/${item}`,
//             name: `${item}`,
//             component: () => import(`@/views/write/${item}.vue`)
//           })
//         } else {
//           router.addRoute('home', {
//             path: `/${item}`,
//             name: `${item}`,
//             component: () => import(`@/views/${item}/${item}.vue`)
//           })
//         }
//       })
//     }
//     if (role === '1') {
//       const arr1 = ['mine', 'write', 'rewrite', 'admin']
//       arr1.forEach(item => {
//         if (item === 'rewrite') {
//           router.addRoute('home', {
//             path: `/${item}`,
//             name: `${item}`,
//             component: () => import(`@/views/write/${item}.vue`)
//           })
//         } else {
//           router.addRoute('home', {
//             path: `/${item}`,
//             name: `${item}`,
//             component: () => import(`@/views/${item}/${item}.vue`)
//           })
//         }
//       })
//     }
//   }
//   next()
// })
router.beforeEach((to, from, next) => {
  if (to.path == '/signInUp') next()
  else {
    const token = sessionStorage.getItem('token')
    if (!token) next('/signInUp')
    else next()
  }
})

export default router