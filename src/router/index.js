import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from '@/lib/axios';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'leaderboard',
    component: () => import(/* webpackChunkName: "leaderboard" */ '../views/Leaderboard.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/scorecards',
    name: 'scorecards',
    component: () => import(/* webpackChunkName: "scorecards" */ '../views/Scorecards.vue'),
  },
  {
    path: '/scorecard/:id',
    name: 'scorecard',
    component: () => import(/* webpackChunkName: "scorecard" */ '../views/Scorecard.vue'),
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/match/:id',
    name: 'matchDetails',
    component: () => import(/* webpackChunkName: "match" */ '../views/MatchDetails.vue'),
    props: true,
  },
  {
    path: '/account',
    name: 'account',
    component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/news',
    name: 'news',
    component: () => import(/* webpackChunkName: "news" */ '../views/News.vue'),
  },
  {
    path: '/players',
    name: 'players',
    component: () => import(/* webpackChunkName: "players" */ '../views/Players.vue'),
  },
  {
    path: '/players/:id',
    name: 'player',
    component: () => import(/* webpackChunkName: "player" */ '../views/Player.vue'),
    props: true,
  }],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && from.name !== 'login') {
    axios.post('refresh', null, { xsrfCookieName: 'csrf_refresh_token' })
      .then(() => next())
      .catch(() => next({ name: 'login' }));
  } else {
    next();
  }
});

export default router;
