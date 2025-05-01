
import { RoomBooking } from '@/types/booking';

// Generate sample data for preview
export function getSampleData(): RoomBooking[] {
  return [
    {
      id: '1',
      roomName: 'Conference Room A',
      bookedBy: 'John Smith',
      date: '2025-05-15',
      startTime: '09:00',
      endTime: '10:00',
      purpose: 'Team Meeting',
      status: 'confirmed'
    },
    {
      id: '2',
      roomName: 'Training Room B',
      bookedBy: 'Sarah Johnson',
      date: '2025-05-16',
      startTime: '13:00',
      endTime: '15:00',
      purpose: 'New Hire Orientation',
      status: 'pending'
    },
    {
      id: '3',
      roomName: 'Executive Suite',
      bookedBy: 'Michael Brown',
      date: '2025-05-17',
      startTime: '10:00',
      endTime: '11:30',
      purpose: 'Board Meeting',
      status: 'confirmed'
    },
    {
      id: '4',
      roomName: 'Meeting Room C',
      bookedBy: 'Lisa Davis',
      date: '2025-05-18',
      startTime: '14:00',
      endTime: '16:00',
      purpose: 'Client Presentation',
      status: 'confirmed'
    },
    {
      id: '5',
      roomName: 'Conference Room A',
      bookedBy: 'Robert Wilson',
      date: '2025-05-19',
      startTime: '11:00',
      endTime: '12:00',
      purpose: 'Department Update',
      status: 'confirmed'
    }
  ];
}
