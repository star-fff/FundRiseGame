import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@shared/schema";
import { Link } from "wouter";
import FundingProgress from "@/components/funding-progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const percentFunded = Math.round((Number(project.currentAmount) / Number(project.goal)) * 100);
  const daysLeft = Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-300">
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full aspect-video object-cover rounded-t-lg"
            />
            <Badge 
              className="absolute top-4 left-4"
              variant={project.status === "active" ? "default" : "secondary"}
            >
              {project.genre}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="mb-2 line-clamp-1">{project.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
          <FundingProgress
            current={Number(project.currentAmount)}
            goal={Number(project.goal)}
          />
        </CardContent>
        <CardFooter className="px-6 py-4 border-t flex justify-between text-sm text-muted-foreground">
          <span>{percentFunded}% профинансировано</span>
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {daysLeft} дней осталось
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}