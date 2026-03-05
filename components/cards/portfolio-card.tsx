"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type PortfolioCardProps = {
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
};

export function PortfolioCard({ title, category, description, image, link = "#" }: PortfolioCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border">
        <div className="relative aspect-[16/10] bg-surface">
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <CardContent className="space-y-3 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{category}</p>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
          <Link href={link} className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111] hover:text-accent">
            View Case Study <ArrowUpRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
