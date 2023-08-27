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

export const labels = [
	{
		value: 'bug',
		label: 'Bug',
	},
	{
		value: 'feature',
		label: 'Feature',
	},
	{
		value: 'documentation',
		label: 'Documentation',
	},
];

export const statuses = [
	{
		value: 'ongoing',
		label: 'On going',
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
