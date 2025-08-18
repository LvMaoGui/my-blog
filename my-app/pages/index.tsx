import type { NextPage } from "next"
import Link from "next/link"
// import { Button } from "@/components/ui/button"
import { Button } from "@/components/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/ui/card"
import { Badge } from "@/components/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Smartphone,
  Cloud,
  Database,
  ArrowRight,
  MapPin,
  Calendar,
  Zap,
  Star,
  Sparkles,
} from "lucide-react"

const Home: NextPage = () => {
  const skills = [
    { name: "React", level: 95, category: "frontend" },
    { name: "Next.js", level: 90, category: "frontend" },
    { name: "TypeScript", level: 88, category: "frontend" },
    { name: "Vue.js", level: 85, category: "frontend" },
    { name: "Node.js", level: 82, category: "backend" },
    { name: "Python", level: 80, category: "backend" },
    { name: "React Native", level: 78, category: "mobile" },
    { name: "AWS", level: 75, category: "cloud" },
  ]

  const projects = [
    {
      id: 1,
      title: "企业级管理系统",
      description: "基于 React + Node.js 构建的现代化企业管理平台，支持多租户、权限管理、数据可视化等功能。",
      image: "/images/project1.jpg",
      tech: ["React", "Node.js", "PostgreSQL", "Redis"],
      github: "https://github.com/codefly/enterprise-system",
      demo: "https://demo.enterprise-system.com",
      featured: true,
    },
    {
      id: 2,
      title: "移动端电商应用",
      description: "React Native 开发的跨平台电商应用，集成支付、物流、客服等完整电商功能。",
      image: "/images/project2.jpg",
      tech: ["React Native", "Redux", "Firebase", "Stripe"],
      github: "https://github.com/codefly/ecommerce-app",
      demo: "https://apps.apple.com/app/ecommerce-demo",
      featured: true,
    },
    {
      id: 3,
      title: "实时协作工具",
      description: "基于 WebRTC 和 Socket.io 的实时协作平台，支持多人在线编辑、视频会议等功能。",
      image: "/images/project3.jpg",
      tech: ["Vue.js", "Socket.io", "WebRTC", "MongoDB"],
      github: "https://github.com/codefly/collaboration-tool",
      demo: "https://collab.codefly.dev",
      featured: false,
    },
  ]

  const experiences = [
    {
      company: "科技创新公司",
      position: "高级全栈工程师",
      period: "2022 - 至今",
      description: "负责核心产品的架构设计与开发，带领团队完成多个重要项目，技术栈涵盖前后端及移动端。",
    },
    {
      company: "互联网独角兽",
      position: "前端技术专家",
      period: "2020 - 2022",
      description: "主导前端技术选型与架构升级，优化系统性能，建立完善的前端工程化体系。",
    },
    {
      company: "初创科技公司",
      position: "全栈开发工程师",
      period: "2018 - 2020",
      description: "从零到一构建产品技术架构，参与产品设计与开发的全流程，快速迭代验证商业模式。",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 min-h-screen flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-sm text-primary/80">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>珠海，中国</span>
                  </div>
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>3+ 年经验</span>
                  </div>
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>可远程</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse drop-shadow-sm">
                      code
                    </span>
                    <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent drop-shadow-sm">
                      Fly
                    </span>
                  </h1>

                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-accent animate-bounce" />
                    <h2 className="text-xl lg:text-2xl text-muted-foreground font-medium">全栈开发工程师 & 技术架构师</h2>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  专注于现代Web技术，擅长构建
                  <span className="text-primary font-semibold"> 高性能</span>、
                  <span className="text-secondary font-semibold">可扩展</span>
                  的应用程序。热爱开源，持续学习，致力于用技术创造价值。
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">
                    联系我
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
                  asChild
                >
                  <Link href="/articles">查看文章</Link>
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
                  asChild
                >
                  <Link href="https://github.com/codefly" target="_blank">
                    <Github className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
                  asChild
                >
                  <Link href="https://linkedin.com/in/codefly" target="_blank">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300"
                  asChild
                >
                  <Link href="mailto:contact@codefly.dev">
                    <Mail className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl shadow-primary/25">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/images/avatar.jpg" alt="codeFly" />
                    <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-muted to-muted-foreground text-foreground">
                      CF
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-background rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-20 bg-muted/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                技能专长
              </h2>
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              掌握现代化的技术栈，从前端到后端，从移动端到云服务，全栈开发经验丰富
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="bg-card/50 border-border backdrop-blur-sm hover:bg-card/70 hover:border-border/80 transition-all duration-300 group"
              >
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {skill.category === "frontend" && <Code className="w-6 h-6 text-primary-foreground" />}
                    {skill.category === "backend" && <Database className="w-6 h-6 text-primary-foreground" />}
                    {skill.category === "mobile" && <Smartphone className="w-6 h-6 text-primary-foreground" />}
                    {skill.category === "cloud" && <Cloud className="w-6 h-6 text-primary-foreground" />}
                  </div>
                  <CardTitle className="text-lg text-foreground text-center">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-muted rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground block text-center">{skill.level}%</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
              精选项目
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">展示一些具有代表性的项目作品，涵盖不同技术栈和应用场景</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects
              .filter((p) => p.featured)
              .map((project) => (
                <Card
                  key={project.id}
                  className="bg-card/30 border-border backdrop-blur-sm overflow-hidden hover:bg-card/50 hover:border-border/80 transition-all duration-300 group"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <div className="text-4xl font-bold text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
                      项目展示
                    </div>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">{project.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
                        asChild
                      >
                        <Link href={project.github} target="_blank">
                          <Github className="w-4 h-4 mr-2" />
                          源码
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0"
                        asChild
                      >
                        <Link href={project.demo} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          演示
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 bg-transparent"
              asChild
            >
              <Link href="/projects">
                查看更多项目
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-20 bg-muted/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              工作经历
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              在不同规模的公司积累了丰富的开发经验，从初创公司到大型互联网企业
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <Card
                  key={index}
                  className="bg-card/30 border-border backdrop-blur-sm hover:bg-card/50 hover:border-border/80 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                          {exp.position}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-primary mt-1">
                          {exp.company}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-border text-muted-foreground bg-card/50">
                        {exp.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm">
                让我们一起创造些什么
              </h2>
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </div>
            <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
              如果您有有趣的项目想法，或者需要技术咨询，欢迎与我联系
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                asChild
              >
                <Link href="/contact">
                  开始合作
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 bg-transparent"
                asChild
              >
                <Link href="/articles">阅读文章</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
