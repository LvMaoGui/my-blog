"use client"

import { type ChangeEvent, useState } from "react"
import { Github, Phone, Shield, Sparkles, Lock, Loader } from "lucide-react"
import CountDown from "components/CountDown"
import request from "service/fetch"
import { useStore } from "store"
import { observer } from "mobx-react-lite"
import { useToast } from "@/components/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"

interface LoginProps {
  isShow: boolean
  onClose: () => void
}

const Login = (props: LoginProps) => {
  const { isShow = false, onClose } = props
  const [form, setForm] = useState({
    phone: "",
    verify: "",
  })
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const store = useStore()
  const { toast } = useToast()

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose()
    }
    // Smooth state reset with delay for better UX
    setTimeout(() => {
      setIsShowVerifyCode(false)
      setForm({ phone: "", verify: "" })
      setIsLoading(false)
    }, 150)
  }

  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      toast({
        title: "请输入手机号",
        description: "请先输入有效的手机号码",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    request
      .post("/api/user/sendVerifyCode", {
        to: form.phone,
        templateId: 1,
      })
      .then((res) => {
        if (res?.code === '0') {
          setIsShowVerifyCode(true)
          toast({
            title: "验证码已发送",
            description: "请查收短信验证码",
          })
        } else {
          toast({
            title: "发送失败",
            description: res?.msg || "未知错误",
            variant: "destructive",
          })
        }
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const handleLogin = () => {
    if (!form.phone || !form.verify) {
      toast({
        title: "请完善信息",
        description: "请输入手机号和验证码",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    request
      .post("/api/user/login", {
        ...form,
        identity_type: "phone",
      })
      .then((res) => {
        if (res?.code === "0") {
          store.user.setUserInfo(res.data)
          toast({
            title: "登录成功",
            description: "欢迎回来！",
          })
          handleClose()
        } else {
          toast({
            title: "登录失败",
            description: res?.msg || "未知错误",
            variant: "destructive",
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // 生成随机字符串用于PKCE和state参数
  const generateRandomString = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  // 生成SHA256哈希
  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return hash
  }

  // 将ArrayBuffer转换为base64url
  const base64urlencode = (arrayBuffer: ArrayBuffer) => {
    const bytes = new Uint8Array(arrayBuffer)
    let str = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      str += String.fromCharCode(bytes[i])
    }
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true)
      
      // 从环境变量获取GitHub客户端ID
      const response = await request.get('/api/oauth/config')
      if (response.code !== '0') {
        throw new Error('获取OAuth配置失败')
      }
      
      const { githubClientId } = response.data
      
      // 生成PKCE参数
      const codeVerifier = generateRandomString(128)
      const codeChallenge = base64urlencode(await sha256(codeVerifier))
      const state = generateRandomString(32)
      
      // 将code_verifier存储到sessionStorage
      sessionStorage.setItem('github_code_verifier', codeVerifier)
      sessionStorage.setItem('github_state', state)
      
      const redirectUri = encodeURIComponent(`${window.location.origin}/api/oauth/redirect`)
      const scope = "user:email"
      
      // 构建GitHub OAuth URL，包含PKCE参数
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`

      const popup = window.open(
        githubAuthUrl, 
        "github-oauth", 
        "width=600,height=700,scrollbars=yes,resizable=yes,left=" + 
        (window.screen.width / 2 - 300) + ",top=" + 
        (window.screen.height / 2 - 350)
      )

      if (!popup) {
        throw new Error('弹窗被阻止，请允许弹窗后重试')
      }

      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return
        }

        if (event.data.type === "OAUTH_SUCCESS") {
          store.user.setUserInfo(event.data.user)
          toast({
            title: "GitHub 登录成功",
            description: `欢迎回来，${event.data.user.nickname}！`,
          })
          handleClose()
          popup?.close()
          window.removeEventListener("message", messageListener)
          // 清理sessionStorage
          sessionStorage.removeItem('github_code_verifier')
          sessionStorage.removeItem('github_state')
        } else if (event.data.type === "OAUTH_ERROR") {
          toast({
            title: "GitHub 登录失败",
            description: event.data.error || "登录过程中发生错误，请重试",
            variant: "destructive",
          })
          popup?.close()
          window.removeEventListener("message", messageListener)
          // 清理sessionStorage
          sessionStorage.removeItem('github_code_verifier')
          sessionStorage.removeItem('github_state')
        }
        setIsLoading(false)
      }

      window.addEventListener("message", messageListener)

      // 检查弹窗是否被关闭
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          window.removeEventListener("message", messageListener)
          setIsLoading(false)
          // 清理sessionStorage
          sessionStorage.removeItem('github_code_verifier')
          sessionStorage.removeItem('github_state')
        }
      }, 1000)
      
      // 设置超时处理
      setTimeout(() => {
        if (!popup?.closed) {
          popup?.close()
          clearInterval(checkClosed)
          window.removeEventListener("message", messageListener)
          setIsLoading(false)
          toast({
            title: "登录超时",
            description: "GitHub 登录超时，请重试",
            variant: "destructive",
          })
          // 清理sessionStorage
          sessionStorage.removeItem('github_code_verifier')
          sessionStorage.removeItem('github_state')
        }
      }, 300000) // 5分钟超时
      
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "GitHub 登录失败",
        description: error instanceof Error ? error.message : "未知错误，请重试",
        variant: "destructive",
      })
    }
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false)
  }

  const handleTestLogin = () => {
    setIsLoading(true)
    request
      .post("/api/user/testlogin", {
        phone: "13800138000",
      })
      .then((res) => {
        if (res?.code === "0") {
          store.user.setUserInfo(res.data)
          toast({
            title: "测试登录成功",
            description: "已使用测试账号登录",
          })
          handleClose()
        } else {
          toast({
            title: "测试登录失败",
            description: res?.msg || "未知错误",
            variant: "destructive",
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Dialog open={isShow} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-2xl p-6">
        <DialogHeader className="text-center space-y-2 pb-1">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            登录
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">选择手机号或 GitHub 登录</DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="space-y-4 p-0 pt-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Phone className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                </div>
                手机号码
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="h-10 pl-3 pr-3 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-200 pointer-events-none peer-focus:opacity-100" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify" className="flex items-center gap-2 text-sm font-medium">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Lock className="h-2.5 w-2.5 text-green-600 dark:text-green-400" />
                </div>
                验证码
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="verify"
                    name="verify"
                    type="text"
                    placeholder="请输入验证码"
                    value={form.verify}
                    onChange={handleFormChange}
                    className="h-10 pl-3 pr-3 border-2 border-slate-200 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetVerifyCode}
                  disabled={isShowVerifyCode || isLoading || !form.phone}
                  className="h-10 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200 whitespace-nowrap min-w-[100px] font-medium text-sm"
                >
                  {isShowVerifyCode ? (
                    <CountDown
                      time={60}
                      onEnd={() => {
                        setIsShowVerifyCode(false)
                      }}
                    />
                  ) : isSending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "获取验证码"
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !form.phone || !form.verify}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  立即登录
                </div>
              )}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 px-3 text-muted-foreground font-medium">
                  其他登录方式
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full h-10 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg transition-all duration-200 transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                  连接 GitHub...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  使用 GitHub 登录
                </div>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleTestLogin}
              disabled={isLoading}
              className="w-full h-8 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                开发者测试登录
              </div>
            </Button>

            <div className="pt-2">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                注册登录即表示同意我们的{" "}
                <a
                  href="https://moco.imooc.com/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 font-medium"
                >
                  隐私政策
                </a>{" "}
                和{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 font-medium"
                >
                  服务条款
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default observer(Login)
