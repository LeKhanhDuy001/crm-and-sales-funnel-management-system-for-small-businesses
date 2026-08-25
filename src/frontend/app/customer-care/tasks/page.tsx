import TasksPage from '../../../components/tasks/tasks-page';

export default function CustomerCareTasksPage() {
  return (<TasksPage canManage canAssign={false}/>);
}