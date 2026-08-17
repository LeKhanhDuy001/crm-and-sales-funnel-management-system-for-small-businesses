import type { FormEvent, } from 'react';
import styles from './admin-products-page.module.css';

interface Props {
  searchInput: string;
  category: string;
  status: string;
  categories: string[];
  onSearchInputChange: (value: string,) => void;
  onSearch: (event: FormEvent<HTMLFormElement>,) => void;
  onCategoryChange: (value: string,) => void;
  onStatusChange: (value: string,) => void;
  onCreate: () => void;
}

export default function ProductFilters({
  searchInput,
  category,
  status,
  categories,
  onSearchInputChange,
  onSearch,
  onCategoryChange,
  onStatusChange,
  onCreate,
}: Props) {
  return (
    <div className={styles.filters}>
      <form className={styles.searchForm} onSubmit={onSearch}>
        <input type="search" value={searchInput}
          placeholder="Tìm theo tên hoặc danh mục..."
          onChange={(event) => onSearchInputChange(event.target.value,)}
        />

        <button type="submit">
          Tìm kiếm
        </button>
      </form>

      <select value={category}
        onChange={(event) => onCategoryChange(event.target.value,)}
      >
        <option value="">
          Tất cả danh mục
        </option>

        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={status}
        onChange={(event) => onStatusChange(event.target.value,)}
      >
        <option value="">
          Tất cả trạng thái
        </option>

        <option value="true">
          Đang hoạt động
        </option>

        <option value="false">
          Ngừng hoạt động
        </option>
      </select>

      <button type="button" onClick={onCreate}>
        + Thêm sản phẩm
      </button>
    </div>
  );
}