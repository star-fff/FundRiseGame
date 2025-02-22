import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Pledge, Project } from "@shared/schema";
import { Loader2, History } from "lucide-react";
import ProjectCard from "@/components/project-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: pledges, isLoading: loadingPledges } = useQuery<Pledge[]>({
    queryKey: ["/api/user/pledges"],
  });

  const { data: projects, isLoading: loadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (loadingPledges || loadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const backedProjects = projects?.filter((project) =>
    pledges?.some((pledge) => pledge.projectId === project.id)
  );

  const totalBacked = pledges?.reduce(
    (sum, pledge) => sum + Number(pledge.amount),
    0
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
          <span className="text-3xl text-primary-foreground">
            {user?.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">
            Backed {backedProjects?.length || 0} projects
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Funding History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              ${totalBacked?.toFixed(2) || "0.00"}
              <span className="text-sm text-muted-foreground ml-2">
                Total backed
              </span>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pledges?.map((pledge) => {
                    const project = projects?.find(
                      (p) => p.id === pledge.projectId
                    );
                    return (
                      <TableRow key={pledge.id}>
                        <TableCell>
                          {new Date(pledge.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{project?.title}</TableCell>
                        <TableCell className="text-right">
                          ${Number(pledge.amount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backedProjects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {backedProjects?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  You haven't backed any projects yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
