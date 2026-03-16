type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  activeCategoryId: string | null;
  onChange: (categoryId: string | null) => void;
};

const CategoryFilter = ({ categories, activeCategoryId, onChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
          activeCategoryId === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-foreground border-border hover:border-primary/40"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
            activeCategoryId === cat.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary/40"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

