"use client"

import * as React from "react"
import { Palette, RotateCcw, Sparkles, Eye, Settings } from "lucide-react"
import { Button } from "./components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer"
import { Badge } from "./components/ui/badge"
import { Separator } from "./components/ui/separator"
import { useTheme } from "@/components/hooks/use-theme"

const presetColors = [
  { name: "海洋蓝", value: "#0ea5e9", gradient: "from-blue-500 to-cyan-500" },
  { name: "薰衣草", value: "#8b5cf6", gradient: "from-purple-500 to-pink-500" },
  { name: "翡翠绿", value: "#10b981", gradient: "from-emerald-500 to-teal-500" },
  { name: "日落橙", value: "#f59e0b", gradient: "from-orange-500 to-red-500" },
  { name: "樱花粉", value: "#ec4899", gradient: "from-pink-500 to-rose-500" },
  { name: "深海青", value: "#06b6d4", gradient: "from-cyan-500 to-blue-500" },
  { name: "柠檬黄", value: "#eab308", gradient: "from-yellow-500 to-orange-500" },
  { name: "暗夜紫", value: "#7c3aed", gradient: "from-violet-500 to-purple-500" },
]

const colorOptions = [
  {
    key: "primary",
    label: "主色调",
    description: "主要按钮和链接颜色",
    icon: "🎨",
  },
  {
    key: "secondary",
    label: "次要色",
    description: "次要元素和背景色",
    icon: "🎭",
  },
  {
    key: "accent",
    label: "强调色",
    description: "强调和高亮颜色",
    icon: "✨",
  },
  {
    key: "background",
    label: "背景色",
    description: "页面主背景颜色",
    icon: "🖼️",
  },
  {
    key: "foreground",
    label: "前景色",
    description: "文字和图标颜色",
    icon: "📝",
  },
]

export function ThemeCustomizer() {
  const { customColors, setCustomColors, resetCustomColors } = useTheme()
  const [activeSection, setActiveSection] = React.useState<"presets" | "custom">("presets")

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 px-0"
      >
        <Palette className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">自定义主题</span>
      </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[100%] max-w-md ml-auto border-l-2 border-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800">
          <DrawerHeader className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <DrawerTitle className="flex items-center gap-2 text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              主题定制器
            </DrawerTitle>
            <DrawerDescription className="text-base">打造专属于你的界面风格 ✨</DrawerDescription>
          </DrawerHeader>

          {/* Section Tabs */}
          <div className="flex p-4 gap-2 bg-white/50 dark:bg-slate-800/50">
            <Button
              variant={activeSection === "presets" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("presets")}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              预设主题
            </Button>
            <Button
              variant={activeSection === "custom" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection("custom")}
              className="flex-1"
            >
              <Palette className="w-4 h-4 mr-2" />
              自定义
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {activeSection === "presets" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">精选配色方案</h3>
                    <Badge variant="secondary" className="text-xs">
                      8个
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {presetColors.map((preset, index) => (
                      <button
                        key={preset.name}
                        onClick={() => setCustomColors({ primary: preset.value })}
                        className="group relative overflow-hidden rounded-xl border-2 border-muted hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        title={preset.name}
                      >
                        <div className={`h-20 bg-gradient-to-br ${preset.gradient} relative`}>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800">
                          <div className="font-medium text-sm text-center">{preset.name}</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">{preset.value}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "custom" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">颜色配置</h3>
                  <Badge variant="outline" className="text-xs">
                    高级
                  </Badge>
                </div>

                {colorOptions.map((option, index) => (
                  <div
                    key={option.key}
                    className="space-y-3 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{option.icon}</div>
                      <div className="flex-1">
                        <label className="text-sm font-semibold">{option.label}</label>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <input
                          type="color"
                          value={customColors[option.key as keyof typeof customColors] || "#000000"}
                          onChange={(e) => setCustomColors({ [option.key]: e.target.value })}
                          className="w-12 h-12 rounded-xl border-2 border-muted cursor-pointer hover:border-primary transition-colors"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3 text-primary-foreground m-0.5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customColors[option.key as keyof typeof customColors] || ""}
                          onChange={(e) => setCustomColors({ [option.key]: e.target.value })}
                          placeholder="#000000"
                          className="w-full px-3 py-2.5 text-sm border rounded-lg bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Quick Color Swatches */}
                    <div className="flex flex-wrap gap-2">
                      {presetColors.slice(0, 6).map((preset) => (
                        <button
                          key={`${option.key}-${preset.name}`}
                          onClick={() => setCustomColors({ [option.key]: preset.value })}
                          className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-700 shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200"
                          style={{ backgroundColor: preset.value }}
                          title={`${option.label} - ${preset.name}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Color Preview Section */}
            <div className="mt-6 space-y-4">
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  颜色预览
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(customColors).map(([key, value]) => (
                    <div key={key} className="text-center group">
                      <div
                        className="w-full h-14 rounded-lg border-2 border-muted mb-2 group-hover:border-primary transition-colors shadow-sm"
                        style={{ backgroundColor: value || "#f3f4f6" }}
                      />
                      <div className="text-xs text-muted-foreground capitalize font-medium">{key}</div>
                      <div className="text-xs text-muted-foreground/60 font-mono">
                        {value?.slice(0, 7) || "#f3f4f6"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="flex gap-3 pb-2">
              <Button
                variant="outline"
                onClick={resetCustomColors}
                className="flex-1 flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 transition-colors bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </Button>
              <DrawerClose asChild>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  完成
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Enhanced Theme Preview Component
export function ThemePreview() {
  const { resolvedTheme, customColors } = useTheme()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-medium">当前主题模式</div>
          <div className="flex items-center gap-2">
            <Badge variant={resolvedTheme === "dark" ? "default" : "secondary"} className="text-xs">
              {resolvedTheme === "dark" ? "🌙 暗色模式" : "☀️ 亮色模式"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="text-sm font-medium">配色方案</div>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(customColors).map(([key, value]) => (
            <div key={key} className="text-center group">
              <div className="relative">
                <div
                  className="h-12 w-full rounded-lg border-2 border-muted group-hover:border-primary transition-all duration-200 shadow-sm group-hover:shadow-md"
                  style={{ backgroundColor: value || "transparent" }}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xs text-muted-foreground mt-2 capitalize font-medium">{key}</div>
              <div className="text-xs text-muted-foreground/60 font-mono">{value?.slice(0, 7) || "default"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
        <div className="text-sm text-blue-700 dark:text-blue-300 text-center">✨ 主题配置已应用到整个界面</div>
      </div>
    </div>
  )
}
