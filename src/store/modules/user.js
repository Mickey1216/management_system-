import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRoutes,anyRoutes,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    buttons:[],
    roles:[],
    resultAsyncRoutes:[],
    resultAllRoutes:[]
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    //只是计算出异步路由
    state.resultAsyncRoutes = asyncRoutes
    //计算出当前用户的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

//两个数组进行对比，对比当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name) !== -1){
      //递归：多级路由
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}

const actions = {
  //登录业务
  async login({ commit }, userInfo) {
    //解构出用户名和密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if(result.code === 20000){
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    }else{
      return new Promise.reject(new Error('failure'))
    }
  },
  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //存储用户的全部信息
        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

