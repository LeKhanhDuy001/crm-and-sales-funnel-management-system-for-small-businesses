import AppShell from "@/components/AppShell";

const leads = [
  {
    id: "LD001",
    name: "Nguyễn Văn An",
    company: "Công ty An Phát",
    email: "an.nguyen@example.com",
    phone: "0901 234 567",
    source: "Website",
    owner: "Trần Minh",
    status: "Mới",
  },
  {
    id: "LD002",
    name: "Trần Thị Mai",
    company: "Công ty Minh Long",
    email: "mai.tran@example.com",
    phone: "0902 345 678",
    source: "Facebook",
    owner: "Lê Hải",
    status: "Đã liên hệ",
  },
  {
    id: "LD003",
    name: "Phạm Quốc Huy",
    company: "Doanh nghiệp Quốc Huy",
    email: "huy.pham@example.com",
    phone: "0903 456 789",
    source: "Giới thiệu",
    owner: "Trần Minh",
    status: "Đủ điều kiện",
  },
  {
    id: "LD004",
    name: "Lê Thị Ngọc",
    company: "Công ty Hoàng Ngọc",
    email: "ngoc.le@example.com",
    phone: "0904 567 890",
    source: "Sự kiện",
    owner: "Nguyễn Hà",
    status: "Không phù hợp",
  },
  {
    id: "LD005",
    name: "Hoàng Minh Tuấn",
    company: "Công ty Tuấn Minh",
    email: "tuan.hoang@example.com",
    phone: "0905 678 901",
    source: "Website",
    owner: "Lê Hải",
    status: "Đã chuyển đổi",
  },
];

function statusStyle(status: string) {
  switch (status) {
    case "Mới":
      return "bg-slate-100 text-slate-700";
    case "Đã liên hệ":
      return "bg-blue-50 text-blue-700";
    case "Đủ điều kiện":
      return "bg-emerald-50 text-emerald-700";
    case "Không phù hợp":
      return "bg-red-50 text-red-700";
    case "Đã chuyển đổi":
      return "bg-violet-50 text-violet-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function LeadsPage() {
  return (
    <AppShell
      title="Quản lý khách hàng tiềm năng"
      description="Theo dõi và quản lý toàn bộ khách hàng tiềm năng"
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng Lead", "248"],
          ["Lead mới", "42"],
          ["Đủ điều kiện", "86"],
          ["Đã chuyển đổi", "54"],
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
            <div className="relative w-full max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>

              <input
                type="search"
                placeholder="Tìm theo tên, email hoặc công ty..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-600"
              />
            </div>

            <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none">
              <option>Tất cả trạng thái</option>
              <option>Mới</option>
              <option>Đã liên hệ</option>
              <option>Đủ điều kiện</option>
              <option>Không phù hợp</option>
              <option>Đã chuyển đổi</option>
            </select>

            <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none">
              <option>Tất cả nguồn</option>
              <option>Website</option>
              <option>Facebook</option>
              <option>Giới thiệu</option>
              <option>Sự kiện</option>
            </select>
          </div>

          <button
            type="button"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Thêm Lead
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  <input type="checkbox" aria-label="Chọn tất cả" />
                </th>
                <th className="px-5 py-4">Khách hàng tiềm năng</th>
                <th className="px-5 py-4">Liên hệ</th>
                <th className="px-5 py-4">Nguồn</th>
                <th className="px-5 py-4">Nhân viên phụ trách</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Chọn ${lead.name}`}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
                        {lead.name
                          .split(" ")
                          .slice(-2)
                          .map((word) => word[0])
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {lead.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {lead.id} · {lead.company}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm">{lead.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {lead.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm">{lead.source}</td>

                  <td className="px-5 py-4 text-sm">{lead.owner}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        lead.status,
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                    >
                      Chi tiết
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
            Hiển thị 1–5 trong tổng số 248 khách hàng tiềm năng
          </p>

          <div className="flex items-center gap-2">
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
              3
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