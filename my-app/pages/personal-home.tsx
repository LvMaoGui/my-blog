import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Badge } from '@/components/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/components/ui/avatar';
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
  Download,
  MapPin,
  Calendar
} from 'lucide-react';

const PersonalHome: NextPage = () => {
  const skills = [
    { name: 'React', level: 95, category: 'frontend' },
    { name: 'Next.js', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 88, category: 'frontend' },
    { name: 'Vue.js', level: 85, category: 'frontend' },
    { name: 'Node.js', level: 82, category: 'backend' },
    { name: 'Python', level: 80, category: 'backend' },
    { name: 'React Native', level: 78, category: 'mobile' },
    { name: 'AWS', level: 75, category: 'cloud' },
  ];

  const projects = [
    {
      id: 1,
      title: '企业级管理系统',
      description: '基于 React + Node.js 构建的现代化企业管理平台，支持多租户、权限管理、数据可视化等功能。',
      image: '/images/project1.jpg',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      github: 'https://github.com/codefly/enterprise-system',
      demo: 'https://demo.enterprise-system.com',
      featured: true
    },
    {
      id: 2,
      title: '移动端电商应用',
      description: 'React Native 开发的跨平台电商应用，集成支付、物流、客服等完整电商功能。',
      image: '/images/project2.jpg',
      tech: ['React Native', 'Redux', 'Firebase', 'Stripe'],
      github: 'https://github.com/codefly/ecommerce-app',
      demo: 'https://apps.apple.com/app/ecommerce-demo',
      featured: true
    },
    {
      id: 3,
      title: '实时协作工具',
      description: '基于 WebSocket 的实时协作平台，支持文档编辑、视频会议、屏幕共享等功能。',
      image: '/images/project3.jpg',
      tech: ['Vue.js', 'Socket.io', 'WebRTC', 'MongoDB'],
      github: 'https://github.com/codefly/collaboration-tool',
      demo: 'https://collab.codefly.dev',
      featured: false
    }
  ];

  const experiences = [
    {
      company: '科技创新公司',
      position: '高级全栈工程师',
      period: '2022 - 至今',
      description: '负责核心产品的架构设计与开发，带领团队完成多个重要项目，技术栈涵盖前后端及移动端。'
    },
    {
      company: '互联网独角兽',
      position: '前端技术专家',
      period: '2020 - 2022',
      description: '主导前端技术选型与架构升级，优化系统性能，建立完善的前端工程化体系。'
    },
    {
      company: '初创科技公司',
      position: '全栈开发工程师',
      period: '2018 - 2020',
      description: '从零到一构建产品技术架构，参与产品设计与开发的全流程，快速迭代验证商业模式。'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>珠海，中国</span>
                  <span>•</span>
                  <Calendar className="w-4 h-4" />
                  <span>3+ 年经验</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  codeFly
                </h1>
                <h2 className="text-xl lg:text-2xl text-muted-foreground">
                  全栈开发工程师 & 技术架构师
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg">
                  专注于现代Web技术，擅长构建高性能、可扩展的应用程序。
                  热爱开源，持续学习，致力于用技术创造价值。
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    联系我
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  下载简历
                </Button>
              </div>
              
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://github.com/codefly" target="_blank">
                    <Github className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="https://linkedin.com/in/codefly" target="_blank">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="mailto:contact@codefly.dev">
                    <Mail className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/images/avatar.jpg" alt="codeFly" />
                    <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-blue-100 to-purple-100">
                      CF
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">技能专长</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              多年的开发经验让我在各个技术领域都有深入的理解和实践
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['frontend', 'backend', 'mobile', 'cloud'].map((category) => {
              const categorySkills = skills.filter(skill => skill.category === category);
              const categoryNames = {
                frontend: '前端开发',
                backend: '后端开发', 
                mobile: '移动开发',
                cloud: '云服务'
              };
              const categoryIcons = {
                frontend: Code,
                backend: Database,
                mobile: Smartphone,
                cloud: Cloud
              };
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              
              return (
                <Card key={category} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">精选项目</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              这里展示了我参与开发的一些代表性项目，涵盖了不同的技术栈和应用场景
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {projects.filter(p => p.featured).map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <Code className="w-16 h-16 text-blue-600" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    <Badge variant="secondary">精选</Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.github} target="_blank">
                          <Github className="w-4 h-4 mr-2" />
                          源码
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={project.demo} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          演示
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">
                查看更多项目
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">工作经历</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              在不同规模的公司积累了丰富的开发和管理经验
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-full" />
                    {index < experiences.length - 1 && (
                      <div className="w-0.5 h-24 bg-gray-200 mt-4" />
                    )}
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{exp.position}</CardTitle>
                          <CardDescription className="text-lg font-medium text-blue-600">
                            {exp.company}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{exp.period}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            让我们一起创造些什么
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            如果您有有趣的项目想法，或者需要技术咨询，
            我很乐意与您交流合作的可能性。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                开始对话
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/projects">
                查看作品集
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalHome;