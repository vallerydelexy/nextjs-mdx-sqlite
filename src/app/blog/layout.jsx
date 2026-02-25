import Grain from "@/components/Grain";

export default async function Blog({ children }) {
  return (
    <div className="max-w-7xl mx-auto py-4">
      <Grain />
      <main className="py-4">{children}</main>
    </div>
  );
}
