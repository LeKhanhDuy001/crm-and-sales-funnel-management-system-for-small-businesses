'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h1>403 - Không có quyền truy cập</h1>

        <p>
          Tài khoản của bạn không được phép
          truy cập trang này.
        </p>

        <button
          type="button"
          onClick={() =>
            router.replace('/login')
          }
        >
          Quay lại đăng nhập
        </button>
      </div>
    </main>
  );
}