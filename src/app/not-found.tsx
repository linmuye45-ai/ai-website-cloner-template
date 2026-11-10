import Link from "next/link";
import { BrandMark } from "@/components/platform/BrandMark";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-20 text-center text-foreground">
      <BrandMark size={40} />
      <p className="caption-3 mt-6 text-muted-foreground tnum">404</p>
      <h1 className="heading-4 mt-2 max-w-md">
        未找到该页面，可能是链接已变更。
      </h1>
      <p className="body-6 mt-3 max-w-md text-muted-foreground">
        您可以直接返回知微 DeepScholar 官网首页，继续批改主观题或进入一对一推导工作台。
      </p>
      <Link
        href="/"
        className="btn-primary-flagship mt-8 inline-flex items-center rounded-lg px-5 py-2.5 button-sm"
      >
        返回官网首页
      </Link>
    </main>
  );
}
