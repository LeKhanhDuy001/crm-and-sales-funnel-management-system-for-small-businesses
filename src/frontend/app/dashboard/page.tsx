import AppShell from "@/components/AppShell";

const statistics = [
  {
    label: "Khách hàng tiềm năng",
    value: "248",
    change: "+12,5%",
    note: "so với tháng trước",
    icon: "◎",
  },
  {
    label: "Khách hàng",
    value: "126",
    change: "+8,2%",
    note: "so với tháng trước",
    icon: "♙",
  },
  {
    label: "Cơ hội bán hàng",
    value: "84",
    change: "+5,7%",
    note: "so với tháng trước",
    icon: "▤",
  },
  {
    label: "Doanh thu dự kiến",
    value: "1,28 tỷ",
    change: "+16,4%",
    note: "so với tháng trước",
    icon: "₫",
  },
];

const activities = [
  {
    title: "Nguyễn Văn An được chuyển thành khách hàng",
    user: "Trần Minh – Sales",
    time: "10 phút trước",
  },
  {
    title: "Báo giá BG-2026-001 đã được tạo",
    user: "Lê Hải – Sales",
    time: "35 phút trước",
  },
  {
    title: "Cơ hội Công ty ABC chuyển sang giai đoạn Đề xuất",
    user: "Nguyễn Hà – Sale Manager",
    time: "1 giờ trước",
  },
  {
    title: "Khách hàng mới Công ty Minh Phát được thêm",
    user: "Trần Minh – Sales",
    time: "2 giờ trước",
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      description="Theo dõi tổng quan hoạt động bán hàng của hệ thống CRM"
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                {item.icon}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-900">
                {item.change}
              </span>
              <span className="text-slate-500">{item.note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Doanh thu bán hàng</h2>
              <p className="mt-1 text-sm text-slate-500">
                Doanh thu theo từng tháng trong năm 2026
              </p>
            </div>

            <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none">
              <option>Năm 2026</option>
              <option>Năm 2025</option>
            </select>
          </div>

          <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-slate-300 px-4 pt-8">
            {[35, 52, 43, 68, 58, 74, 62, 82, 70, 88, 76, 94].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end"
                  title={`Tháng ${index + 1}`}
                >
                  <div
                    className="w-full rounded-t bg-slate-300 hover:bg-slate-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ),
            )}
          </div>

          <div className="mt-3 grid grid-cols-12 gap-3 px-4 text-center text-xs text-slate-500">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index}>T{index + 1}</span>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Tổng quan Pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">
            Giá trị cơ hội theo giai đoạn
          </p>

          <div className="mt-6 space-y-5">
            {[
              ["Khách hàng tiềm năng", "32", 78],
              ["Đủ điều kiện", "24", 62],
              ["Đề xuất", "16", 48],
              ["Đàm phán", "9", 32],
              ["Thành công", "3", 18],
            ].map(([name, number, width]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="text-slate-500">{number} cơ hội</span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-slate-700"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-lg bg-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Tổng giá trị Pipeline
            </p>
            <p className="mt-1 text-2xl font-bold">2,45 tỷ VNĐ</p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-lg font-bold">Hoạt động gần đây</h2>
            <p className="mt-1 text-sm text-slate-500">
              Các hoạt động mới nhất trong hệ thống
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Xem tất cả
          </button>
        </div>

        <div className="divide-y divide-slate-200">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="flex items-start gap-4 px-6 py-4"
            >
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                ✓
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-800">
                  {activity.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activity.user}
                </p>
              </div>

              <span className="whitespace-nowrap text-xs text-slate-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}