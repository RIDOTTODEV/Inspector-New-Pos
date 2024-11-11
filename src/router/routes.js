const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      /********** product definitions **********/
      { path: '', name:'dashboard', component: () => import('pages/IndexPage.vue'), meta:{groupName:'index',requiredPermission:'Pos.DashBoard.ShowList'}, },
      { path: 'table', name:'table', component: () => import('pages/TablePage.vue'), meta:{groupName:'table',requiredPermission:'Pos.Table.ShowList'},},
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
