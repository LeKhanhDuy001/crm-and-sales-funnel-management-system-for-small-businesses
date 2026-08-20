'use client';

import Link from 'next/link';
import { useEffect, useState, } from 'react';
import { usePathname } from 'next/navigation';
import { getAccessToken } from '../../modules/auth/auth.storage';
import { getUnreadCount } from '../../modules/notifications/notifications.service';

interface Props {
  linkClassName: string;
  activeClassName: string;
}

export default function NotificationMenuLink({ linkClassName, activeClassName, }: Props) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount,] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      return;
    }

    async function loadCount(accessToken: string,): Promise<void> {
      try {
        const response = await getUnreadCount(accessToken,);
        setUnreadCount(response.unreadCount,);
      } catch {
        setUnreadCount(0);
      }
    }
    void loadCount(token);
  }, [pathname]);

  const isActive = pathname.startsWith('/sales/notifications',);

  return (
    <Link href="/sales/notifications" className={isActive ? activeClassName : linkClassName}>
      <span>🔔</span>
      <span>Thông báo</span>
      {unreadCount > 0 && (
        <strong>
          ({unreadCount})
        </strong>
      )}
    </Link>
  );
}