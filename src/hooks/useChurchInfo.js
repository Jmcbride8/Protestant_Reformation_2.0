import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const DEFAULT_INFO = {
  church_name: 'Hope Santa Barbara',
  tagline: 'A place and platform for life and relationships.',
  address: '123 Hope Street, Santa Barbara, CA 93101',
  maps_url: 'https://maps.google.com/?q=Hope+Church+Santa+Barbara+CA',
  maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.1!2d-119.6982!3d34.4208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDI1JzE1LjAiTiAxMTnCsDQxJzUzLjUiVw!5e0!3m2!1sen!2sus!4v1234567890',
  phone: '(805) 555-HOPE',
  email: 'hello@hopesantabarbara.org',
  office_hours: 'Mon–Fri, 9:00 AM – 4:00 PM',
  sunday_times_display: 'Sundays 9:00 & 11:00 AM',
  service_times: [
    { day: 'Sunday', time: '9:00 AM', label: 'Morning Worship' },
    { day: 'Sunday', time: '11:00 AM', label: 'Main Service' },
    { day: 'Wednesday', time: '7:00 PM', label: 'Midweek Prayer' },
  ],
};

export function useChurchInfo() {
  const { data } = useQuery({
    queryKey: ['churchInfo'],
    queryFn: async () => {
      const results = await base44.entities.ChurchInfo.filter({ key: 'main' });
      return results?.[0] || null;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { ...DEFAULT_INFO, ...data };
}