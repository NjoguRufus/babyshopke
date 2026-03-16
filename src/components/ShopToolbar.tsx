type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
};

const ShopToolbar = ({ search, onSearchChange, sort, onSortChange }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
      <div className="w-full md:max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for baby products..."
          className="w-full rounded-full border px-4 py-2.5 text-sm bg-card"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">Sort by</label>
        <select
          className="rounded-full border bg-card px-3 py-1.5 text-xs"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="featured">Featured</option>
        </select>
      </div>
    </div>
  );
};

export default ShopToolbar;

