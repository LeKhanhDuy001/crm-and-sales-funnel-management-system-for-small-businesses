import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
            C
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Đăng nhập hệ thống CRM
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Nhập thông tin tài khoản để tiếp tục
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="admin@crm.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-700"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </label>

            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" />
              Ghi nhớ đăng nhập
            </label>

            <button
              type="button"
              className="font-medium text-slate-700 underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Link
            href="/dashboard"
            className="block w-full rounded-lg bg-slate-900 py-3 text-center font-semibold text-white hover:bg-slate-800"
          >
            Đăng nhập
          </Link>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          © 2026 CRM Management System
        </p>
      </section>
    </main>
  );
}