import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  title: string;
  description: string;
  items: string[];
};

export function ServiceCard({ title, description, items }: ServiceCardProps) {
  return (
    <Card className="h-full border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="mb-6 space-y-2 text-sm text-muted">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/contact" className="inline-flex items-center gap-2">
            Start Your Project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
