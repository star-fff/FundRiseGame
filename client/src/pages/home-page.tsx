import ProjectCard from "@/components/project-card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Project } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const popularProjects = projects?.sort((a, b) => 
    Number(b.currentAmount) - Number(a.currentAmount)
  ).slice(0, 6);

  const newProjects = projects?.sort((a, b) =>
    new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  ).slice(0, 6);

  const recommendedProjects = projects?.filter(project => 
    Number(project.currentAmount) > Number(project.goal) * 0.8
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Поддержите будущее игровой индустрии
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          GameStarter - это место, где инновационные игровые проекты встречаются с теми, 
          кто готов помочь им стать реальностью.
        </p>
      </div>

      {/* Projects Sections */}
      <div className="container mx-auto py-8">
        <Tabs defaultValue="popular" className="space-y-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="popular">Популярные</TabsTrigger>
            <TabsTrigger value="new">Новинки</TabsTrigger>
            <TabsTrigger value="recommended">Рекомендуемые</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-6">
            <h2 className="text-2xl font-bold">Популярные проекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularProjects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <h2 className="text-2xl font-bold">Новые проекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newProjects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <h2 className="text-2xl font-bold">Рекомендуемые проекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProjects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {projects?.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Пока нет доступных проектов
          </p>
        )}
      </div>
    </div>
  );
}