interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: Props) => {
  return (
    <div className="bg-secondary/50 border-border hover:border-primary/50 rounded-lg border p-6 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default ServiceCard;
