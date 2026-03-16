type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const EmptyState = ({ title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
    <p className="text-base font-semibold text-foreground">{title}</p>
    {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;

