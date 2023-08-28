import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	CrossCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
} from '@radix-ui/react-icons';

export const types = [
	{
		value: 'technical issue',
		label: 'Technical Issue',
	},
];

export const statuses = [
	{
		value: 'in progress',
		label: 'In Progress',
		icon: StopwatchIcon,
	},
	{
		value: 'resolved',
		label: 'Resolved',
		icon: CheckCircledIcon,
	},
	{
		value: 'unresolved',
		label: 'Unresolved',
		icon: QuestionMarkCircledIcon,
	},
];

export const priorities = [
	{
		label: 'Low',
		value: 'low',
		icon: ArrowDownIcon,
	},
	{
		label: 'Medium',
		value: 'medium',
		icon: ArrowRightIcon,
	},
	{
		label: 'High',
		value: 'high',
		icon: ArrowUpIcon,
	},
];
