import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Project, Tier, Pledge } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FundingProgress from "@/components/funding-progress";
import ProjectStats from "@/components/project-stats";

export default function ProjectPage() {
  const { id } = useParams();
  const { data: project, isLoading: loadingProject } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
  });

  const { data: tiers, isLoading: loadingTiers } = useQuery<Tier[]>({
    queryKey: [`/api/projects/${id}/tiers`],
  });

  const { data: pledges, isLoading: loadingPledges } = useQuery<Pledge[]>({
    queryKey: [`/api/projects/${id}/pledges`],
  });

  if (loadingProject || loadingTiers || loadingPledges) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Проект не найден</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg"
          />

          <div className="my-6">
            <FundingProgress
              current={Number(project.currentAmount) / 100}
              goal={Number(project.goal) / 100}
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Жанры: {project.genre}
          </p>
          <div className="prose prose-invert max-w-none mb-8 whitespace-pre-wrap">
            {project.description}
          </div>

          {pledges && <ProjectStats project={project} pledges={pledges} />}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Варианты поддержки</h2>
          {tiers?.map((tier) => (
            <Card key={tier.id} className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{tier.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">
                    {(Number(tier.amount) / 100).toLocaleString()} ₽
                  </span>
                  <Button className="bg-button-primary text-background hover:bg-button-primary/90">
                    Поддержать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}