import AppShell from "@/components/layout/app-shell";

type Deal = {
  id: string;
  name: string;
  company: string;
  value: string;
  probability: number;
  owner: string;
  closingDate: string;
};

type PipelineColumn = {
  name: string;
  total: string;
  deals: Deal[];
};

const pipeline: PipelineColumn[] = [
  {
    name: "Khách hàng tiềm năng",
    total: "620 triệu",
    deals: [
      {
        id: "DL001",
        name: "Triển khai CRM",
        company: "Công ty An Phát",
        value: "350 triệu",
        probability: 20,
        owner: "Trần Minh",
        closingDate: "30/08/2026",
      },
      {
        id: "DL002",
        name: "Gói phần mềm Sales",
        company: "Công ty Minh Long",
        value: "270 triệu",
        probability: 20,
        owner: "Lê Hải",
        closingDate: "05/09/2026",
      },
    ],
  },
  {
    name: "Đủ điều kiện",
    total: "480 triệu",
    deals: [
      {
        id: "DL003",
        name: "Nâng cấp hệ thống",
        company: "Công ty Quốc Huy",
        value: "280 triệu",
        probability: 40,
        owner: "Nguyễn Hà",
        closingDate: "25/08/2026",
      },
      {
        id: "DL004",
        name: "Gói chăm sóc khách hàng",
        company: "Công ty Hoàng Ngọc",
        value: "200 triệu",
        probability: 40,
        owner: "Trần Minh",
        closingDate: "10/09/2026",
      },
    ],
  },
  {
    name: "Đề xuất",
    total: "390 triệu",
    deals: [
      {
        id: "DL005",
        name: "Tích hợp bán hàng",
        company: "Công ty Tuấn Minh",
        value: "390 triệu",
        probability: 60,
        owner: "Lê Hải",
        closingDate: "20/08/2026",
      },
    ],
  },
  {
    name: "Đàm phán",
    total: "510 triệu",
    deals: [
      {
        id: "DL006",
        name: "Hệ thống CRM Enterprise",
        company: "Công ty Đại Thành",
        value: "510 triệu",
        probability: 80,
        owner: "Nguyễn Hà",
        closingDate: "15/08/2026",
      },
    ],
  },
  {
    name: "Thành công",
    total: "450 triệu",
    deals: [
      {
        id: "DL007",
        name: "CRM Standard",
        company: "Công ty Phú Gia",
        value: "450 triệu",
        probability: 100,
        owner: "Trần Minh",
        closingDate: "01/08/2026",
      },
    ],
  },
];

export default function DealsPage() {
  return (
    <AppShell
      title="Pipeline bán hàng"
      description="Theo dõi và quản lý các cơ hội bán hàng theo từng giai đoạn"
    >
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
            <option>Pipeline bán hàng chính</option>
          </select>

          <select className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
            <option>Tất cả nhân viên</option>
            <option>Trần Minh</option>
            <option>Lê Hải</option>
            <option>Nguyễn Hà</option>
          </select>

          <input
            type="search"
            placeholder="Tìm kiếm cơ hội..."
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <button
          type="button"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          + Thêm cơ hội
        </button>
      </section>

      <section className="mt-6 overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {pipeline.map((column) => (
            <div
              key={column.name}
              className="w-80 shrink-0 rounded-xl bg-slate-200/70 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <h2 className="font-bold text-slate-800">
                    {column.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {column.deals.length} cơ hội · {column.total}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg"
                  aria-label={`Thêm cơ hội vào ${column.name}`}
                >
                  +
                </button>
              </div>

              <div className="space-y-3">
                {column.deals.map((deal) => (
                  <article
                    key={deal.id}
                    className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          {deal.id}
                        </p>
                        <h3 className="mt-1 font-bold text-slate-900">
                          {deal.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        className="text-lg text-slate-400"
                        aria-label="Thêm thao tác"
                      >
                        ⋮
                      </button>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {deal.company}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-bold">{deal.value}</span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                        {deal.probability}%
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-slate-700"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>♙ {deal.owner}</span>
                        <span>◷ {deal.closingDate}</span>
                      </div>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:bg-white"
                >
                  + Thêm cơ hội
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Tổng cơ hội", "84"],
          ["Tổng giá trị", "2,45 tỷ VNĐ"],
          ["Doanh thu dự kiến", "1,28 tỷ VNĐ"],
          ["Tỷ lệ thành công", "28,6%"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}