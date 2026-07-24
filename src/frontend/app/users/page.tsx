import AppShell from "@/components/AppShell";

const users = [
  {
    id: "USR001",
    name: "Nguyễn Hoàng Nam",
    email: "nam.nguyen@crm.com",
    phone: "0901 111 222",
    role: "Admin",
    status: "Đang hoạt động",
    createdAt: "10/01/2026",
  },
  {
    id: "USR002",
    name: "Nguyễn Thị Hà",
    email: "ha.nguyen@crm.com",
    phone: "0902 222 333",
    role: "Sale Manager",
    status: "Đang hoạt động",
    createdAt: "15/01/2026",
  },
  {
    id: "USR003",
    name: "Trần Minh",
    email: "minh.tran@crm.com",
    phone: "0903 333 444",
    role: "Sales",
    status: "Đang hoạt động",
    createdAt: "20/01/2026",
  },
  {
    id: "USR004",
    name: "Lê Hải",
    email: "hai.le@crm.com",
    phone: "0904 444 555",
    role: "Sales",
    status: "Đang hoạt động",
    createdAt: "25/01/2026",
  },
  {
    id: "USR005",
    name: "Phạm Thị Lan",
    email: "lan.pham@crm.com",
    phone: "0905 555 666",
    role: "Marketing",
    status: "Tạm khóa",
    createdAt: "01/02/2026",
  },
  {
    id: "USR006",
    name: "Hoàng Minh Anh",
    email: "anh.hoang@crm.com",
    phone: "0906 666 777",
    role: "Customer Care",
    status: "Đang hoạt động",
    createdAt: "05/02/2026",
  },
];

function roleStyle(role: string) {
  switch (role) {
    case "Admin":
      return "bg-slate-900 text-white";
    case "Sale Manager":
      return "bg-violet-50 text-violet-700";
    case "Sales":
      return "bg-blue-50 text-blue-700";
    case "Marketing":
      return "bg-amber-50 text-amber-700";
    case "Customer Care":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function UsersPage() {
  return (
    <AppShell
      title="Quản lý người dùng"
      description="Quản lý tài khoản, vai trò và trạng thái hoạt động"
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng tài khoản", "36"],
          ["Đang hoạt động", "32"],
          ["Tạm khóa", "4"],
          ["Vai trò hệ thống", "5"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Tìm theo tên hoặc email..."
              className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none"
            />

            <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
              <option>Tất cả vai trò</option>
              <option>Admin</option>
              <option>Sale Manager</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>Customer Care</option>
            </select>

            <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
              <option>Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Tạm khóa</option>
            </select>
          </div>

          <button
            type="button"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Thêm người dùng
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Người dùng</th>
                <th className="px-5 py-4">Số điện thoại</th>
                <th className="px-5 py-4">Vai trò</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
                        {user.name
                          .split(" ")
                          .slice(-2)
                          .map((word) => word[0])
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.id} · {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm">{user.phone}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyle(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.createdAt}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          user.status === "Đang hoạt động"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                    >
                      Chỉnh sửa
                    </button>

                    <button
                      type="button"
                      className="ml-2 rounded-md px-2 py-1.5 text-lg text-slate-500"
                      aria-label="Thêm thao tác"
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị 1–6 trong tổng số 36 người dùng
          </p>

          <div className="flex gap-2">
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              Trước
            </button>
            <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
              1
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              2
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              Sau
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}