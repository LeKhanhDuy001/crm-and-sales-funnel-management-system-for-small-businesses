import TasksPage from '../../../components/tasks/tasks-page';

export default function SalesTasksPage() {
  return (<TasksPage canManage={false} canAssign={false}/>);
}