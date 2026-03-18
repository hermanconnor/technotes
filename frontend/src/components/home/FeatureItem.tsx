interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: Props) => {
  return (
    <li className="flex gap-4">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h4 className="text-foreground font-medium">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </li>
  );
};

export default FeatureItem;
