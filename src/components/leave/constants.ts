import { CheckCircleIcon, Clock10Icon, XCircleIcon } from 'lucide-react';

export const statuses = [
    {
        value: 'pending',
        label: 'Pending',
        icon: Clock10Icon,
    },
    {
        value: 'approved',
        label: 'Approved',
        icon: CheckCircleIcon,
    },
    {
        value: 'rejected',
        label: 'Rejected',
        icon: XCircleIcon, 
    }
];