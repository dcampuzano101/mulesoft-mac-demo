import Dashboard from "@/components/Dashboard";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      {/* <main className="flex min-h-screen flex-col items-center mt-16 w-full px-5 md:px-20"> */}
      <main className="w-[2000px]">
        <Dashboard />
      </main>
    </div>
  );
}
