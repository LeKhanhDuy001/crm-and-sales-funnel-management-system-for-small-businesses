'use client';

import { type FormEvent, } from 'react';
import styles from './customers-page.module.css';

interface Props {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>,) => void;
}

export default function CustomerFilters({searchInput, onSearchInputChange, onSearch,}: Props) {
  return (
    <form className={styles.filters} onSubmit={onSearch}>
      <input type="search" value={searchInput}
        placeholder="Tìm theo tên, công ty, email, số điện thoại..."
        onChange={(event) => onSearchInputChange(event.target.value,)}
      />
      <button type="submit">
        Tìm kiếm
      </button>
    </form>
  );
}