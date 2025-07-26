type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">
        {title}
      </h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
