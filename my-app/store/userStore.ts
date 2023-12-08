export interface UserInfo {
  userId?: number
  nickname?: string;
  avatar?:string
}

export interface UserStore{
  userInfo:UserInfo;
  // eslint-disable-next-line no-unused-vars
  setUserInfo:(value:UserInfo) => void
}

const userStore = function():UserStore{
  return {
    userInfo:{},
    setUserInfo:function(value:UserInfo){
      this.userInfo = value
    }
  }
}


export default userStore
