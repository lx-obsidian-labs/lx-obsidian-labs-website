import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
};

export function Section({ children, className, containerClassName, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
