import type { FormEvent, } from 'react';
import type { TaskPriority, TaskStatus, } from '../../modules/tasks/tasks.types';
import { getTaskPriorityLabel, getTaskStatusLabel, } from '../../modules/tasks/task-labels';
import styles from './tasks-page.module.css';

interface Props {
  searchInput: string;
  status: string;
  priority: string;
  onSearchInputChange: (value: string,) => void;
  onStatusChange: (value: string,) => void;
  onPriorityChange: (value: string,) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>,) => void;
}

export default function TasksFilterBar({
  searchInput,
  status,
  priority,
  onSearchInputChange,
  onStatusChange,
  onPriorityChange,
  onSubmit,
}: Props) {
  return (
    <form className={styles.filters} onSubmit={onSubmit}>
      <input type="search" value={searchInput}
        placeholder="Tìm theo tiêu đề hoặc mô tả..."
        onChange={(event) => onSearchInputChange(event.target.value,)}
      />

      <select value={status}
        onChange={(event) => onStatusChange(event.target.value,)}
      >
        <option value="">
          Tất cả trạng thái
        </option>

        {(
          [
            'Pending',
            'InProgress',
            'Completed',
          ] as TaskStatus[]
        ).map((item) => (
          <option key={item} value={item}>
            {getTaskStatusLabel(item)}
          </option>
        ))}
      </select>

      <select value={priority}
        onChange={(event) => onPriorityChange(event.target.value,)}
      >
        <option value="">
          Tất cả mức độ
        </option>

        {(
          [
            'Low',
            'Medium',
            'High',
          ] as TaskPriority[]
        ).map((item) => (
          <option key={item} value={item}>
            {getTaskPriorityLabel(item)}
          </option>
        ))}
      </select>

      <button type="submit">
        Tìm kiếm
      </button>
    </form>
  );
}