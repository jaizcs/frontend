import { z } from 'zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import tasks from './data/tasks.json';
import { taskSchema } from './data/schema';

// Simulate a database read for tasks.
function getTasks() {
	return z.array(taskSchema).parse(tasks);
}

export default function SupportTicketsRoute() {
	const tasks = getTasks();

	return (
		<div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
			<DataTable data={tasks} columns={columns} />
		</div>
	);
}
